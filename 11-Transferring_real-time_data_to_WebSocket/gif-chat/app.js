const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ColorHash = require('color-hash');    // [11.4 : 14.] (ColorHash 적용 및 유저 구분 관련)
require('dotenv').config();

const webSocket = require('./socket');
const indexRouter = require('./routes');
const connect = require('./schemas');   // [11.4 : 06.] (서버와 몽구스 연결)

const app = express();
connect();  // [11.4 : 06.] (서버와 몽구스 연결)

// [11.4 : 15.] (입장 시 시스템 메세지 출력 및 0명일 때 방 제거) START
const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});
// [11.4 : 15.] (입장 시 시스템 메세지 출력 및 0명일 때 방 제거) END

app.locals.pretty = true;   // [ME, Custom]

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads'))); // [11.6 : 03.] (GIF 이미지 전송 구현, uploads 폴더 지정)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware); // [11.4 : 15.] (입장 시 시스템 메세지 출력 및 0명일 때 방 제거) 
// [11.4 : 15.] Prev Bak
/*
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
*/
app.use(flash());

// [11.4 : 14.] (ColorHash 적용 및 유저 구분 관련) START
app.use((req, res, next) => {
    // 세션에 color 속성이 없을때, req.sessionID를 바탕으로 color 속성을 생성
    if (!req.session.color) {
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);
    }
    next();
});
// [11.4 : 14.] (ColorHash 적용 및 유저 구분 관련) END

app.use('/', indexRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
    console.log('ADDRESS:', 'http://localhost:' + app.get('port'));
});


// [11.4 : 14.] (ColorHash 적용 및 유저 구분 관련) / app 매개변수 추가.
// [11.4 : 15.] (입장 시 시스템 메세지 출력 및 0명일 때 방 제거)  / sessionMiddleware 매개변수 추가
webSocket(server, app, sessionMiddleware); 
        