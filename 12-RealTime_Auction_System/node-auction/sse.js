// [12.2 : 03]
const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {
        setInterval(() => {
            // 1초마다 접속한 클라이언트에게 서버 시간 타임스탬프를 보냄
            // client.send 로 보낼 수 있음. (문자열만 보낼 수 있음.)
            client.send(new Date().valueOf().toString());
        }, 1000);
    });
};