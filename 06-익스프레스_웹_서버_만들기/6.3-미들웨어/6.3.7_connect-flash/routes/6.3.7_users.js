const express = require('express');
const router = express.Router();

/* GET users listing */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/flash', (req, res) => {
    req.session.message = '세션 메세지';
    req.flash('message', 'flash 메세지');
    res.redirect('/users/flash/result');
});

router.get('/flash/result', (req, res) => {
    // 해당 주소를 방문후, 새로고침하면 flash 메세지는 보이지 않음.
       // flash 미들웨어는 일회성이기에..
    res.send(`${req.session.message} ${req.flash('message')}`);
});

module.exports = router;