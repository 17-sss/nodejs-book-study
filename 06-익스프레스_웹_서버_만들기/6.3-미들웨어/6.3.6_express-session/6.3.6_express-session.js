// [6.3.6] express-session : Pratice
/* 
    + 세션 관리용 미들웨어. 로그인 등의 이유로 세션을 구현할 떄 유용
    + 설치
        - npm i express-session
        
    + express-session은 req 객체안에 req.session 객체를 만듬.
*/
const express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan')
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(cookieParser('secret code'));
/* 
    + express-session 1.5버전 이전에는 내부적으로 cookie-parser를 사용하고 있어서
        cookie-parser 미들웨어 뒤에 사용해야 했음. 현재는 상관 없음 (1.5 버전 이후부턴 상관 없음)
        - 무슨 버전쓰고 있는지 모른다면, cookie-parser 미들웨어 뒤에 놓는게 안전.    
*/
app.use(session({   
    // ▶ resave: 요청이 왔을 때  세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
    resave: false,
    // ▶ saveUninitialized: 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
    saveUninitialized: false,
    // ★ secret: 필수항목 임, cookie-parser의 비밀키와 같은 역할.
    secret: 'secret code',  
    // ▶ cookie: 세션 쿠키에 대한 설정
    cookie: {
        /*
            maxAge, domain, path, expires, sameSite, httpOnly, secure 등
            일반적인 쿠키 옵션이 모두 제공됨.
        */
        // 클라이언트에서 쿠키를 확인하지 못하도록 httpOnly: true로 설정
        httpOnly: true,
        // https가 아닌 환경에서도 사용할 수 있게 secure: false로 설정 (배포시에는 https를 적용하고 true로 설정하는게 좋음)
        secure: false,                              
    },
    /*
        ▶ store 라는 옵션도 있음
            현재는 메모리에 세션을 저장하도록 되어 있음 
            (서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라짐..)
        배포 시에는 store에 데이터베이스를 연결하여 세션을 유지하는게 좋음
    */
}));
