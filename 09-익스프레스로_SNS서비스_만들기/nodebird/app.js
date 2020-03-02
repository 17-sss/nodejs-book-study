// [9.1]
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = requrie('path');
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config(); // [9.1] MEMO_2. 7) dotenv 설정

const pageRouter = require('./routes/page');

const app = express();

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

app.use('/', pageRouter);

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