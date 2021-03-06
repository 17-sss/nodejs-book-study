// [12.1]
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const {sequelize} = require('./models');
const passportConfig = require('./passport');

// [12.2 : 02.] (SSE, Socket.IO 모듈 연결) START
const sse = require('./sse');
const websocket = require('./socket');
// [12.2 : 02.] (SSE, Socket.IO 모듈 연결) END

const checkAuction = require('./checkAuction'); // [12.3 : 03-2.]

const app = express();
sequelize.sync();
passportConfig(passport);

// checkAuction(); // [12.3 : 03-2.]
checkAuction.checkTime();   // 기존의 경매 시간이 만료된 상품을 처리하는 로직 | checkAuction();과 같음
checkAuction.createSchedule();    // [12.4.1 : 03.] (노드 서버 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성)

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8010);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', authRouter);

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

// [12.2 : 02.] (SSE, Socket.IO 모듈 연결) START
websocket(server, app);
sse(server);
// [12.2 : 02.] (SSE, Socket.IO 모듈 연결) END