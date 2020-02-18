// [6.4] users.js
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

module.exports = router;    // router를 모듈로 만듬