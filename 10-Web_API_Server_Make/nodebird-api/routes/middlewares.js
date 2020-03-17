const jwt = require('jsonwebtoken');    // [10.3]

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

// [10.3] START
exports.verifyToken = (req, res, next) => {
    try {
        // jwt.verify 메서드로 토큰을 검증
            // 첫번째 인자는 토큰, 두번째 인자는 토큰의 비밀키
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {   // 유효기간 초과
            return res.status(419).json({
                code: 419,
                message:'토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않는 토큰입니다.',
        });
    }
};


// [10.3] END