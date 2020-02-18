// [4.2] 쿠키와 세션 이해하기
const http = require('http');

// parseCookies
/* 
    쿠키는 name=zero; birth=1993 처럼 문자열 형식으로 오기에 이를
    {
        name: 'zero',
        birth: '1993'   
    }
    와 같이 객체로 바꾸는 함수.
*/
const parseCookies = (cookie = '') => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {      
            acc[k.trim()] = decodeURIComponent(v);
            return acc;   
        }, {});


http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    res.writeHead(200, {'Set-Cookie':'mycookie=test' });
    res.end('Hello Cookie');
})
.listen(8082, () => {
    console.log('========== Welcome ==========\n'
    + 'http://localhost:8082' 
    + '\n8082번 포트에서 서버 대기 중입니다.'
    + '\n=============================');
});
