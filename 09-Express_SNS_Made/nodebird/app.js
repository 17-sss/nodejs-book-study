// [9.1]
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');   // [9.3]

require('dotenv').config(); // [9.1] MEMO_2. 7) dotenv 설정

const pageRouter = require('./routes/page');
const { sequelize } = require('./models');  // [9.2]
const authRouter = require('./routes/auth');    // [9.3.2]  
const passportConfig = require('./passport');   // [9.3] ./passport/index.js' 와 같음

const app = express();
sequelize.sync();   // [9.2]
passportConfig(passport);   // [9.3]

app.locals.pretty = true;   // [ME, Custom]

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser(process.env.COOKIE_SECRET));   // [9.1] MEMO_2. 7) dotenv 관련
// app.use(cookieParser('nodebirdsecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,   // [9.1] MEMO_2. 7) dotenv 관련
    // secret: 'nodebirdsecret',
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(flash());

// [9.3] passport.initialize() 미들웨어는 요청(req 객체)에 passport 설정을 심음
app.use(passport.initialize()); 

// [9.3] passport.session() 미들웨어는  req.session 객체에 passport 정보를 저장
app.use(passport.session());    

app.use('/', pageRouter);
app.use('/auth', pageRouter);      // [9.3.2]  

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

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
    console.log('http://localhost:' + app.get('port'));
});