// [12.1]
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Good, Auction, User } = require('../models');
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

// GET * 메인화면
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

// GET * 회원가입
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
        joinError: req.flash('joinError'),
    });
});

// GET * 상품 등록
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

// POST * 업로드한 상품을 처리하는 라우터
router.post('/good', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const { name, price } = req.body;
        await Good.create({
            ownerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        });

        res.redirect('/');
    } catch(error) { 
        console.error(error);
        next(error);
    }
});


// [12.2 : 07.] (good(상품)관련 라우터 2개 추가) START ---
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.find({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'owner',
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

module.exports = router;