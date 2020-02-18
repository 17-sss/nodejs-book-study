const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = "") => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {      
            acc[k.trim()] = decodeURIComponent(v);
            return acc;   
        }, {});
        
const nPortNum = 8083;
http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, { // [*1*] 아래 설명 참고
            Location: '/',
            'Set-Cookie': 
                `name=${encodeURIComponent(name)};
                Expires=${expires.toGMTString()};HttpOnly;Path=/`, 
        });
        res.end();
    } else if (cookies.name) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`);
    } else {
        fs.readFile('./server4.html', (err, data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    }

}).listen(nPortNum, () => {
    console.log('========== Welcome ==========\n'
                + 'http://localhost:' + nPortNum
                + '\n'+ nPortNum +'번 포트에서 서버 대기 중입니다.'
                + '\n=============================');
});    

/* 
    [*1*]
        + 응답코드가 302일 경우, 리다이렉트 주소(Location)와 함께 쿠키(Set-Cookie)를 헤더에 넣음
        + [*1*] 코드 이전에,  쿠키 만료시간을 expires.setMinutes로 지금으로 부터 5분뒤로 설정
        
        + 쿠키 설정 시, 옵션
            - 쿠키명=쿠키값: 기본적인 쿠키의 값
            - Expires=날짜: 만료기한, 이 기한이 지나면 쿠키가 제거됨.
            - Max-age=초: Expires와 비슷하지만 날짜 대신 초를 입력할 수 있음. 
                해당 초가 지나면 쿠키가 제거됨. Expires보다 우선시 됨.
            - Domain=도메인명: 쿠키가 전송될 도메인을 특정할 수 있음. (기본값은 현재 도메인)
            - Path=URL: 쿠키가 전송될 URL을 특정할 수 있음. (기본값은 '/')
            - Secure: HTTPS일 경우에만 쿠키 전송
            - HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근 불가. (쿠키 조작 방지하기 위해 설정하는게 좋음)
        
            !   Expires 옵션 근처에 줄바꿈이 들어가면 에러 뜸!!        
*/