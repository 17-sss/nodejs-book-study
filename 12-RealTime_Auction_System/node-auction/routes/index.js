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

module.exports = router;