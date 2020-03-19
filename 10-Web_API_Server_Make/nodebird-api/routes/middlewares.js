const jwt = require('jsonwebtoken');    // [10.3]
const RateLimit = require('express-rate-limit');    // [10.6]

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

// [10.6] START
exports.apiLimiter = new RateLimit({
// windowMs: 기준시간
    windowMs: 60 * 1000,    // 1분
// max: 허용 횟수
    max: 1,
// delayMs: 호출 간격
    delayMs: 0,
// handler: 제한 초과시 콜백 함수
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본값 429
            message: '1분에 한 번만 요청할 수 있습니다.',
        });
    },
});

// deprecated 미들웨어(메소드)는 사용하면 안되는 라우터에 붙일 것임.
exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
};
// [10.6] END