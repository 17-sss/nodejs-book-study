// [6.5.1.2] 변수 : 일부 메모
const express = require('express');
const app = express();

// [1] res.render('템플릿', 변수 객체)
app.get('/', (req, res) => {
    // render를 사용해 템플릿에 렌더링할 변수 지정 (render의 두번째 인자)
    res.render('index', {title: 'Express'});
});

// [2] res.locals 사용
//  app.js의 에러 처리 미들웨어처럼 res.locals 객체를 사용하여 변수를 넣을 수 있음
app.get('/', (req, res, next) => {
    /* 
        + 장점
            - 현재 라우터뿐만 아니라 다른 미들웨어에서도 res.locals 객체에 접근 가능
                따라서, 다른 미들웨어에서 템플릿 엔진용 변수를 미리 넣을 수도 있음.
    */
    res.locals.title = 'Express';
    res.render('index');
});
