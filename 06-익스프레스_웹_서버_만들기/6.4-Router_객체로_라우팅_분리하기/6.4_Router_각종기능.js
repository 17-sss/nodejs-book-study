// [6.4] Router 객체로 라우팅 분리하기  : 각종 기능 메모
const express = require('express');
const router = express.Router();

// [1] app.use 처럼 router 하나에 미들웨어를 여러 개 장착가능.
// 로그인 여부 또는 관리자 여부를 체크하는 미들웨어를 중간에 넣어두곤 함
router.get('/login', /*미들웨어1, 미들웨어2, 미들웨어3*/)

// [2] 라우터 관련 설명 (routes 폴더) 
/* 
    + routes를 사용하지 않고, 
        app.js에서 app.get('/', 미들웨어), app.get('/users', 미들웨어)를 해도 기능은 동일함.
        - 하지만 코드 관리를 위해 라우터를 별도로 분리하는 것
    + 라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 함
        응답을 보내지 않으면 브라우저는 계속 응답을 기다림.
        - res 객체에 들어 있는 메서드들로 응답을 보냄
    +  하나의 요청에 대한 응답은 한번만 보내야함!!
*/
//  ================= [2]


// [3] next 함수
/* 
    
    + 라우터의 next 함수
        next 함수는 라우터에서만 동작하는 특수 기능
        사용법: next('route')
        - 라우터에 연결된 나머지 미들웨어들을 건너뛰고 싶을 때 사용
*/
router.get('/', 
    (req, res, next) => {   // 첫번째 미들웨어
        // * next('route') 호출함으로써, 두번째 & 세번쨰 미들웨어는 실행되지 않음
            // 주소와 일치하는 다음 라우터로 넘어감
        next('route'); 
    },
    (req, res, next) => {   // 두번째 미들웨어
        console.log('실행되지 않습니다.')
        next();
    },
    (req, res, next) => {   // 세번째 미들웨어
        console.log('실행되지 않습니다.')
        next();
    },
);

router.get('/', (req, res) => { 
    // * next('route') 위에서 호출해서 이리로 넘어옴
    console.log('실행됩니다.');
    res.render('index', {title: 'Express'});
});
//  ================= [3]


// [4] /:ParamName패턴(와일드카드)
    // /:id 처럼 해당하는 부분의 값을 조회할 수 있음
router.get('/users/:id', (req, res) => {
    console.log(req.params, req.query);

    /* 
        + 쿼리스트링이 주소에 들어왔을 때
        ex) ' /users/123?limit=5&skip=10 ' 이라는 주소의 요청이 들어왔을때
            1) req.params: { id: 123 }
            2) req.query: { limit: '5', skip: '10' };       
            
        + 해당 패턴 사용 시, 주의사항
            - 일단 라우터보다 뒤에 위치해야 함. 그래야 다른 라우터를 방해하지 않음.
            - 에러가 발생하지 않았다면 라우터는 요청을 보낸 클라이언트에게 응답을 보내주어야함.
                ▷ 응답메서드는 여러가지. 책에선 send, sendFile, json, redirect, render를 주로 사용
    */
});
//  ================= [4]


// [5] 상태 제어, 기본적으론 200 상태 코드를 응답 
// res.status 사용하여 직접 바꿀 수 있음
    // + res.redirect는 코드 302 임.
router.get('/not', (req, res, next) => {
    res.status(404).send('NOT FOUND');
});