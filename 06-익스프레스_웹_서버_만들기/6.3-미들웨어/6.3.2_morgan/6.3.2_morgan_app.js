// [6.3.2] morgan : Pratice
// 콘솔에 나오는 GET / 200 51.267 ms - 1599 같은 로그는 모두 morgan 미들웨어에서 나오는 것.
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

/* 
  (morgan)
  * logger 함수 인자
    + logger 함수의 인자로는 dev, short, common, combined 등이 있음
      인자에 따라 콘솔에 나오는 로그가 다름.
      1) 개발 시에는 short나 dev를 많이 씀.
      2) 배포 시에는 common이나 combined를 많이 사용

*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
