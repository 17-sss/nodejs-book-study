// [4.1] 요청과 응답 이해하기
const http = require('http');

const server = http.createServer( (req, res) => {
    // res.write 여러 개 호출해서 데이터 여러 개를 보내도 되고, 문자열이 아닌 버퍼를 보낼 수도 있음
    res.write('<h1>Hello Node!</h1>');  
    // res.end 응답을 종료하는 메서드
        // end에 인자('<h1>Hello Server!</h1>' 등..)가
        // 있다면 해당 데이터도 보내고 응답 종료
    res.end('<h1>Hello Server!</h1>');     
});

server.listen(8080);
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다!');
});
server.on('error', (error) => {
    console.error(error);
});

/* 
    [1]
        http.createServer( (req, res) => {
            res.write('<h1>Hello Node!</h1>');
            res.end('<h1>Hello Server!</h1>');
        }).listen(8080, () => {
            console.log('8080번 포트에서 서버 대기 중입니다.');
        });

    [2]
        server.listen(8080);
        server.on('listening', () => {
            console.log('8080번 포트에서 서버 대기 중입니다!');
        });

    ** [1]의 .listen(8080, 콜백)과 [2]는 같음
        listen 메세드에 콜백 함수 대신, on메서드에 listening 이벤트 리스너를 붙여서 작업해도 됨.
*/