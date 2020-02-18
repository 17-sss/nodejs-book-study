// [4.4] https와 http2
// ** https 적용 예제
const http = require('http');
const fs = require('fs');
const nPortNum = 8080;

http.createServer(
{   
/* 
    - 암호화를 적용하려면 https 모듈을 사용해야.
    - https는 암호화를 적용하는 만큼 인증해줄 기관이 필요
        인증서는 인증기관에서 구입해야하며
        구입한 인증서가 있을시에는 해당 중괄호(첫번째 인자)처럼
        작업해두어야함.
*/
    
    // 첫번째 인자: 인증서에 관련된 옵션 객체
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
    /* 
    - 인증서를 구입하면 pem이나 crt, 또는 key 확장자를 가진 파일을 제공해 줌
        파일들을 fs.readFileSync 메서드로 읽어서 cert, key, ca 옵션에 알맞게 넣어주면 됨.
    */

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

