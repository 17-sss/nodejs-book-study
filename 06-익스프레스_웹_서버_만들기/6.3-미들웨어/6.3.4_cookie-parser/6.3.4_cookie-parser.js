// [6.3.4] cookie-parser : Pratice
// cookie-parser는 요청에 동봉된 쿠키를 해석해줌

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// 아래와 같이 첫 번째 인자로 문자열을 넣어줄 수 있음.
app.use(cookieParser('secret code'));
/* 
    이 쿠키들은 제공한 문자열로 서명된 쿠키가 됨
    서명된 쿠키는 클라이언트에서 수정했을 때 에러가 발생하므로 
    클라이언트에서 쿠키로 위험한 행동 하는 것을 방지 가능
*/