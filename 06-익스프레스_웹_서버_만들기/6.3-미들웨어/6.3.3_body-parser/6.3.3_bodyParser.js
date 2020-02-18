// [6.3.3] body-parser : Pratice
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  

// [1 : START] JSON, URL-encoded 형식의 본문 해석 기능
// body-parser 형식 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// [1 : END] 

// [1-1 : START :: express]
/* 
  Express-Generator로 생성한 프로젝트에서는 body-parser를 사용하지 않았음.
*/
// express 형식 (body-parser 일부 기능이 express에 내장됨(4.16 Ver 부터.))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// [1-1 : END]


// [2 : START] Raw, Text 형식 본문 해석
app.use(bodyParser.raw());  // Raw는 본문이 버퍼 데이터 일 때 사용
app.use(bodyParser.text()); // Text는 본문이 텍스트 데이터 일때 사용
// [2 : END]

// [MEMO]
/* 
  + JSON은 JSON 형식의 데이터 전달 방식
  + URL-encoded는 주소 형식으로 데이터를 보내는 방식  
    - urlencoded 메서드의 extended 옵션
      1) false면 노드의 querystring 모듈을 사용하여 쿼리스트링 해석
      2) true면 qs 모듈을 사용하여 쿼리스트링 해석
        ! qs 모듈은 npm 패키지임. querystring 모듈 기능을 확장한 모듈

  + body-parser가 모든 본문을 해석해주는게 아님.
    form 태그의 multipart/form-data 형식으로 전송된 데이터는 해석 불가
      - 다른 모듈 사용해야함. 
*/
