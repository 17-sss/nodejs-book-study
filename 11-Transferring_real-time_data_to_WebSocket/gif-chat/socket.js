// [11.4] (/room, /chat 웹 소켓 이벤트 연결)
const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});  

    app.set('io', io);  //+ req.app.get('io')로 접근 가능

    /* 
        - of 메서드. Socket.IO에 네임스페이스를 부여하는 메서드
            Socket IO는 기본적으로 / 네임스페이스에 접속하지만, 
            of 메서드를 사용하면 다른 네임스페이스를 만들어 접속할 수 있음. 
            같은 네임스페이스끼리만 데이터 전달.
    */
    const room = io.of('/room');
    const chat = io.of('/chat');

    // /room 네임스페이스에 이벤트 리스너 붙임
    room.on('connection', (socket) => { 
        console.log('room 네임스페이스에 접속');

        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });


    // /chat 네임스페이스에 이벤트 리스너 붙임
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/,'');
        
            socket.join(roomId);    // 채팅방에 들어가는 메서드 (접속 시)

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);   // 채팅방에서 나가는 메서드 (접속 해제 시)
        });
    });
};