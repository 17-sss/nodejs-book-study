// [6.3.5] static : Pratice
// static 미들웨어는 정적인 파일을 제공
const express = require('express');
const app = express();
const path = require('path');


/*  
    [1]
    + 정적 파일들이 담겨 있는 폴더 지정: public 폴더로 지정
        - public/stylesheets/styles.css 는
            https://localhost:3000/stylesheets/style.css 로 접근가능
            ▷ 서버의 폴더 경로에는 public이 들어 있지만, 요청 주소에는 public이 들어 있지 않음

    + 정적 파일들을 알아서 제공해주므로 fs.readFile로 파일을 직접 읽어서 전송할 필요가 없음.    
*/
app.use(express.static(path.join(__dirname, 'public')));

// [2] 정적 파일을 제공할 주소를 지정 [ /img 지정, 즉 https://localhost:3000/img ]
app.use('/img', express.static(path.join(__dirname, 'public')));


/*
    [MEMO]
    + static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당 파일을 전송
        이 경우 응답을 보냈으므로 다음에 나오는 라우터가 실행되지 않음.
        (만약 파일을 찾지 못했다면 요청을 라우터로 넘김)
        
    + 자체적으로 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치하는 것이 좋음.
        그래야 서버가 쓸데없는 미들웨어 작업을 하는 것을 막을 수 있음
        - static 미들웨어를 morgan보다도 더 위로 올리면 정적 파일 요청이 기록되지 않기에 morgan 다음에 배치
*/




