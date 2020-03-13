// [9.3.1]
// 말이 좋아 미들웨어같은 기분.. 다 객체화 시키고 가져다 쓰는 느낌.
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};