// [12.1]
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');  // [12.3 : 02] 


const { Good, Auction, User, sequelize } = require('../models'); // [12.3 : 02] /sequelize 추가
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    /* 
        res.locals.user에 req.user 변수를 집어넣음으로써
        res.render 메서드에 user: req.user를 하지 않아도 되므로 중복을 제거할 수 있음.
    */
    res.locals.user = req.user;
    next();
});

// GET : / * 메인화면
router.get('/', async(req, res, next) => {
    try {
        // soldId가 낙찰자의 아이디이므로 낙찰자가 null이면 경매가 진행 중인것.
        const goods = await Good.findAll({where: {soldId: null}});
        res.render('main', {
            title: 'NodeAuction',
            goods,
            loginError: req.flash('loginError'),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET : /join * 회원가입
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
        joinError: req.flash('joinError'),
    });
});

// GET : /good * 상품 등록
router.get('/good', isLoggedIn, (req, res) => {
    res.render('good', {title: '상품 등록 - NodeAuction'});
});

fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 *1024 },
});

// POST : /good * 업로드한 상품을 처리하는 라우터
router.post('/good', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const { name, price } = req.body;     
        // [12.4.1 : 02.] (경매 시간을 자유롭게 조정할 수 있게 만들기) START  ===  
        let { timeHour, timeMin } = req.body; 
        timeHour = parseInt(timeHour);
        timeMin = parseInt(timeMin);
        // [12.4.1 : 02.] (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===

        const good =  await Good.create({   // [12.3 : 02] / 변수화
            ownerId: req.user.id,
            name,
            img: req.file.filename,
            price,        
            timeHour,
            timeMin,   
        });
        
        // [12.3 : 02] START 
        const end = new Date();        
        // end.setDate(end.getDate() + 1); // 하루 뒤
        
        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) START ===
        end.setHours(end.getHours() + timeHour);
        end.setMinutes(end.getMinutes() + timeMin);
        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===
        

        // 일정을 예약하는 메서드: schedulejob(실행될 시각, 해당 시간이 되었을 때 수행할 콜백)
        schedule.scheduleJob(end, async() => {
            // 1) 경매 모델에서 가장 높은 입찰을 한 사람을 찾고
            const success = await Auction.find({
                where: {goodId: good.id},
                order: [[
                    'bid', 'DESC'
                ]],
            });

            // [12.4.1 : 04.] (아무도 입찰을 하지 않아 낙찰자가 없을 때 처리) [if ~ else문 추가]
            if (success !== null) {             
                if (good.soldId === null) {
                    // 2) 상품 모델의 낙찰자 아이디에 넣어주도록 정의.
                    await Good.update({soldId: success.userId}, { where: {id: good.id} });
                    // 3) 낙찰자의 보유자산을 낙찰 금액만큼 뺌.
                    await User.update({
                        /* 
                            +컬럼: sequelize.literal(컬럼-숫자)
                                시퀄라이즈에서 해당 컬럼의 숫자를 줄이는 방법
                                (숫자를 늘리려면 - 대신 +로)
                        */
                        money: sequelize.literal(`money - ${success.bid}`),
                    }, {
                        where: { id: success.userId },
                    });    
                }
            } else {
                const findGood = await Good.find({
                    where: {id: good.id},
                });

                if (findGood.deletedAt === null) {
                    await Good.destroy({where: {id: good.id}}); // [12.4.1 : 04.] (아무도 입찰을 하지 않아 낙찰자가 없을 때 처리)                     
                }                
            }               
        });
        // [12.3 : 02] END

        res.redirect('/');
    } catch(error) { 
        console.error(error);
        next(error);
    }
});


// [12.2 : 07.] (good(상품)관련 라우터 2개 추가) START ---
// GET : /good/:id * 해당(id) 상품과 기존 입찰 정보들을 불러온뒤 렌더링하는 라우터
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.find({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'owner',
                    /* 
                        + Good 모델에 User 모델을 include할 때 as 속성을 사용한것에 주의.
                            - Good 모델과 User 모델은 현재 일대다 관계가 두번 연결(owner, sold)
                            되어 있으므로 이런 경우에는 어떤 관계를 include할지 as 속성으로 밝혀주어야.
                    */
                },
            }),
            Auction.findAll({
                where: { goodId: req.params.id },
                include: { model: User},
                order: [['bid', 'ASC']],
            }),
        ]);

        res.render('auction', {
            title: `${good.name} - NodeAuction`,
            good,
            auction,
            auctionError: req.flash('auctionError'),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST : /good/:id/bid * 클라이언트로부터 받은 입찰 정보를 저장
router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
    try {
        const { bid, msg } = req.body;
        const good = await Good.find({
            where: { id: req.params.id },
            include: { model: Auction },
            order: [[{model: Auction}, 'bid', 'DESC']],
        });

        if (good.price > bid) { // 시작 가격보다 낮게 입찰하면
            return res.status(403).send('시작 가격보다 높게 입찰해야 합니다');
        }

        // 경매 종료 시간이 지났으면.
        if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
            return res.status(403).send('경매가 이미 종료되었습니다.');
        }

        // 직전 입찰가와 현재 입찰가 비교
        if (good.auctions[0] && good.auctions[0].bid >= bid) {
            return res.status(403).send('이전 입찰가보다 높아야 합니다');
        }

        // [12.4.1 : 01] (상품 등록자는 입찰 불가) START --
        if (good.ownerId === req.user.id) {
            return res.status(403).send('자신이 등록한 상품은 입찰할 수 없습니다.');
        }
        // [12.4.1 : 01] (상품 등록자는 입찰 불가) END ---

        const result = await Auction.create({
            bid,
            msg,
            userId: req.user.id,
            goodId: req.params.id,
        });

        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        });

        return res.send('ok');
        
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
// [12.2 : 07.] (good(상품)관련 라우터 2개 추가) END ---

// [12.4 : 01.] (낙찰자가 낙찰 내역 볼 수 있게 작업) START ---
router.get('/list', isLoggedIn, async(req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: { soldId: req.user.id },
            include: { model: Auction },
            order: [[{model: Auction }, 'bid', 'DESC']],
        });

        res.render('list', {title: '낙찰 목록 - NodeAuction', goods});
    } catch (error) {
        console.error(error);
        next(error);
    } 
});
// [12.4 : 01.] (낙찰자가 낙찰 내역 볼 수 있게 작업) END ---


// 200403_TEST!
router.get('/test', async (req, res, next) => {
    const end = new Date();
    console.log(end);
    end.setHours(end.getHours() - 1);
    console.log(end);
    
    res.render('test', {title: 'TEST'});   
    
    
    /*
    try {
        const goods = await Good.find({where: {ownerId: req.user.id}});
        console.log('===========');
        console.log(goods);
        res.render('test', {title: 'TEST'});    
    } catch (error) {
        console.error(error);
        next(error);
    }
    */
    
});
// ------ TEST


module.exports = router;