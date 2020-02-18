// [6.5.3] 에러 처리 미들웨어  : Pratice

const express = require('express');
const app = express();

// 에러 핸들러
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error'); 
});

/* 
    + error 객체는 시스템 환경이 development(개발 환경)가 아닌 경우에만 표시
    + req.app.get(키)는 req.app을 통해서 app 객체에 접근하는 것.
        - app.get(키)가 app.set(키)로 설정했던 것을 가져오는 코드이므로 req.app.get(키)로도 가능.
            ex) app.set('view engine', 'pug')를 했다면 
                app.get('view engine')으로 pug라는 값을 가져올 수 도 있음
*/