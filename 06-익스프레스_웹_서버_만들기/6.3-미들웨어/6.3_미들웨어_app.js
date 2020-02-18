// [6.3] 미들웨어 : Pratice
/* 
    + 요청과 응답의 중간에 위치하여 미들웨어라 부름
        - 라우터와 에러 핸들러 또한 미들웨어의 일종
    + 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도하고, 나쁜 요청을 걸러냄
    + app.use 메서드의 인자로 들어 있는 함수가 미들웨어.
*/

// (app.js 파일 사본)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//// === 미들웨어 구역 START ====================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 처리 미들웨어
app.use(function(req, res, next) {
  next(createError(404));
});

//에러 핸들러
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//// === 미들웨어 구역 END ====================================

module.exports = app;
