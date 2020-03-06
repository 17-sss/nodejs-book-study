// [9.1]
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // [9.3.1]

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

router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: req.user, // [9.3.1]
        // user: null,  // [9.1]
        loginError: req.flash('loginError'),
    });
});

module.exports = router;