// [9.1]
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // [9.3.1]
const { Post, User } = require('../models');    // [9.4]
const router = express.Router();

/*
// [9.1]
router.get('/profile', (req, res) => {
    res.render('profile', {title: '내 정보 - NodeBird', user: null});
});
*/

// [9.3.1]
router.get('/profile', isLoggedIn, (req, res) => {  
    res.render('profile', {title: '내 정보 - NodeBird', user: req.user });
});
// --

// router.get('/join', (req, res) => {  // [9.1]
router.get('/join', isNotLoggedIn, (req, res) => { // [9.3.1]
    res.render('join', {
        title: '회원가입 - NodeBird', 
        user: req.user, // [9.3.1]
        // user: null,  // [9.1]
        joinError: req.flash('joinError'),
    });
});

/*
// [9.1] ~ [9.3]
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: req.user, // [9.3.1]
        // user: null,  // [9.1]
        loginError: req.flash('loginError'),
    });
});
*/

// [9.4] 
// async await ver
router.get('/', async(req, res, next) => {
    try {
        const posts = await Post.findAll({
        
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                },
            // [9.5.1] 스스로해보기 - 게시글 (좋아요) 누르기 및 좋아요 취소하기 START === 
                // include에서 같은 모델이 여러개면 as로 구분
                { 
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Liker',
                }
            ],
            // [9.5.1] 스스로해보기 - 게시글 (좋아요) 누르기 및 좋아요 취소하기 END ===
            order: [
                ['createdAt', 'DESC']
            ],
        });

        // console.log(posts); // [9.5.1] 게시글 (좋아요) 누르기 및 좋아요 취소하기 TEST
        
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
            user: req.user,
            loginError: req.flash('loginError'),
        });
    } catch (error) {
        console.error(error);
        next(error);    
    }    
});
/*
// Promise Ver
router.get('/', (req, res, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nick'],
        },
        order: [
            ['createdAt', 'DESC']
        ],
    })
        .then((posts) => {
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error)=>{
            console.error(error);
            next(error);
        });
});
*/



module.exports = router; 