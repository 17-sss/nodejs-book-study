// [4.4] https와 http2
const http = require('http');
const nPortNum = 8080;

http.createServer((req, res) => {
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
}).listen(nPortNum, () => {
    console.log('========== Welcome ==========\n'
                + 'http://localhost:' + nPortNum
                + '\n'+ nPortNum +'번 포트에서 서버 대기 중입니다.'
                + '\n=============================');
});    