// [4.1] 요청과 응답 이해하기
const http = require('http');
const fs = require('fs');

http.createServer( (req, res) => {
    fs.readFile('./server2.html', (err, data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
}).listen(8081, () => {
    console.log('========== Welcome ==========\n'
                + 'http://localhost:8081' 
                + '\n8081번 포트에서 서버 대기 중입니다.'
                + '\n=============================');
});