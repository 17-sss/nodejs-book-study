// [6.4] Router 객체로 라우팅 분리하기  : Pratice
const express = require('express');
const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./6.4_Router_객체로_라우팅_분리하기/users');

// 주소가 '/' 로 시작하면 routes/index.js를 '/users'로 시작하면 routes/users.js를 호출하라는 의미
app.use('/', indexRouter);
app.use('/users', usersRouter);


// use 대신 get, post, patch, delete 같은 HTTP 메서드를 사용할 수도 있음
/* 
    + use 메서드는 모든 HTTP 메서드에 대해 요청 주소만 일치하면 실행됨
    + get, post, put, patch, delete 같은 메서드는 주소뿐만 아니라 HTTP메서드까지 일치하는 요청일 때만 실행
*/
app.use('/', (req, res, next) => {
    console.log('/ 주소의 요청일 때 실행됩니다. HTTP 메서드는 상관없습니다.');
    next();
});

app.get('/', (req, res, next) => {
    console.log('GET 메서드 / 주소의 요청일 때만 실행됩니다.');
    next();
});

app.post('/data', (req, res, next) => {
    console.log('POST 메서드 /data 주소의 요청일 때만 실행됩니다.');
    next();
});
