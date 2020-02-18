// [6.3.1]  커스텀 미들웨어 만들기 : Pratice

// (app.js 파일 사본)
// 이 코드들 한번 테스트 해볼거면 원본에다가 복사해서 테스트

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
// [6.3.1 - 1] START @@@@@@@@@
app.use(function (req, res, next) {
    console.log(req.url, '저도 미들웨어입니다.');
    next();    
});

// [6.3.1 : 1] MEMO
/* 
  + 미들웨어 안에서 next()를 호출해야 다음 미들웨어로 넘어감! 
  + 미들웨어 안에서 next()를 넣지 않는다면 해당 미들웨어(커스텀 미들웨어)에서 요청의 흐름이 끊김

  + logger, express.json, express.urlencoded, cookieParser 등
    모두 내부적으로 next()를 호출하므로 다음 미들웨어로 넘어갈 수 있음

  + next 함수의 기능
    + 인자의 종류로 기능이 구분됨. 
      - 인자를 아무것도 넣지 않으면 단순하게 다음 미들웨어로 넘어감
      - 인자로 route를 넣으면 특수한 기능을 함. (추후 라우터 파트에서 배움)
        ▷ route 외의 다른 값을 넣으면 다른 미들웨어나 라우터를 건너 뛰고
          바로 에러 핸들러로 이동. 넣어준 값은 에러에 대한 내용으로 간주            
*/
// [6.3.1 : 1] END @@@@@@@@@

// [6.3.1 : 2] START @@@@@@@@@
// * 하나의 use에 미들웨어를 여러개 장착하는 법
app.use('/', 
  (req, res, next) => {
    console.log('첫 번째 미들웨어');
    next();
  }, 
  (req, res, next) => {
    console.log('두 번째 미들웨어');
    next();  
  },
  (req, res, next) => {
    console.log('세 번째 미들웨어');
    next();  
  },
);
// [6.3.1 : 2] END @@@@@@@@@

// [6.3.1 : 2-1] START @@@@@@@@@
// ex) express-generator 생성 코드 줄이기
/*
// 하지만 가독성이 좋지 않아 사용하지 않음
app.use(logger('dev'), express.json(), express.urlencoded({ extended: false }), 
  cookieParser(), express.static(path.join(__dirname, 'public')));
*/
// [6.3.1 : 2-1] END @@@@@@@@@


// [6.3.1 : 3] START @@@@@@@@@
/* 
  - next를 호출하지 않으면 다음 미들웨어로 넘어가지 않음. 
    이 성질을 사용해 이런 미들웨어도 만들 수 있음.
*/
// ex) 50% 확률로 404 에러를 읍답하거나 다음 미들웨어로 넘어가는 미들웨어.
app.use(
  (req, res, next) => {
    if (+ new Date() % 2 === 0) {
      return res.status(404).send('50% 실패');
    } else {
      next();
    }
  }, 
  (req, res, next) => {
    console.log('50% 성공');
    next();
  }
);
// [6.3.1 : 3] END @@@@@@@@@

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
