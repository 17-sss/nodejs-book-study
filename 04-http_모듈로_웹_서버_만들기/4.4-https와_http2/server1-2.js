// [4.4] https와 http2
// ** http2 적용 예제 
/* 
    - https 보다 훨씬 효율적
    - https 모듈과 유사. 
        createServer 메서드를 createSecureServer로만 바꿔주면 됨.
*/

const http2 = require('http2');
const fs = require('fs');
const nPortNum = 8080;

http2.createSecureServer(
{   
    // 첫번째 인자: 인증서에 관련된 옵션 객체
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
},
(req, res) => { // 두번째 인자: https 모듈과 같이 서버 로직.
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
}).listen(nPortNum, () => {
    console.log('========== Welcome ==========\n'
                + 'http://localhost:' + nPortNum
                + '\n'+ nPortNum +'번 포트에서 서버 대기 중입니다.'
                + '\n=============================');
});    

