// [6.3.7] connect-flash : Pratice

// 일회성 메세지들을 웹 브라우저에 나타낼 때 유용 (상대적으로 중요도 떨어짐)
// 설치: npm i connect-flash
// * 이 미들웨어는 cookie-parser와 express-session을 사용하므로 이들보다 뒤에 위치해야 함.
const express = require('express');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());

/* 
    + flash 미들웨어는 req 객체에 req.flash 메서드를 추가
        - req.flash(키, 값)으로 해댕 키에 값을 설정
        - req.flash(키)로 해당 키에 대한 값을 불러옴
*/