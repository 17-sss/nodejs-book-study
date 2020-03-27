// Socket IO Version
const SocketIO = require('socket.io');

module.exports = (server) => {
    // 두번째 인자는 옵션
    // 여기서는 클라이언트와 연결할 수 있는 경로를 의미하는 path만 사용
    const io = SocketIO(server, {path: '/socket.io'});  

    // - connection: 클라이언트가 접속했을 때 발생하고, 콜백으로 소켓 객체(socket) 제공
    io.on('connection', (socket) => {   // io와 socket 객체가 Socket.IO의 핵심
        const req = socket.request;
        /* 
            - socket.request 속성으로 요청 객체에 접근 가능
            - socket.request.res는 응답 객체에 접근 가능
        */
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // socket.id로 소켓 고유 아이디 가져올 수 있음
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);   

        socket.on('disconnect', () => { // disconnect, 클라이언트가 연결을 끊었을 때 발생
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => { // error, 통신 과정 중 에러가 나왔을 때 발생
            console.error(error);
        });
        socket.on('reply', (data) => { // reply는 사용자가 직접 만든 이벤트
            // 클라이언트에서 reply라는 이벤트명으로 데이터 보낼 때 서버에서 받는 부분.
            console.log(data);
        });
        socket.interval = setInterval(() => {
            /* 
                첫 번째 인자는 이벤트 이름, 두 번째 인자는 데이터
                news라는 이벤트이름으로 Hello Socket.IO 라는 데이터를 클라이언트에 보낸것.
                클라이언트가 이 메세지를 받기 위해서는 news 이벤트 리스너를 만들어두어야함 (뷰 부분에)
            */
            socket.emit('news', 'Hello Socket.IO'); 

        }, 3000);
    });
};