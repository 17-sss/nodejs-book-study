// [11.4] (/room, /chat 웹 소켓 이벤트 연결)
const SocketIO = require('socket.io');
const axios = require('axios');     // [11.4 : 16.] (socket에 express-session 적용)
const cookieParser = require('cookie-parser');  // [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기)
const cookie = require('cookie-signature');     // [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기)

module.exports = (server, app, sessionMiddleware) => { // [11.4 : 16.] sessionMiddleware 추가
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

    // [11.4 : 16.] (socket에 express-session 적용) START --
    io.use((socket, next) => { 
        /* 
            io.use 메서드에 미들웨어 장착
            세션 미들웨어에 요청 객체, 응답 객체, next 함수를 넣어주면 됨.
        */
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    // [11.4 : 16.] (socket에 express-session 적용) END --

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

            //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) [작업을 위해 주석처리] START
            /*  

            // [11.4 : 16.] (socket에 express-session 적용) START --
            //- socket.to(방 아이디): 특정방에 데이터를 보냄
            socket.to(roomId).emit('join', {    
                // [ME] emit: 이벤트를 다른쪽으로 전달. 여기선 'join'이벤트로 전달. chat.pug에 있음.
                user: 'system',
                chat: `${req.session.color}님이 입장하셨습니다.`,

                // [11.6.1 : 01.] (채팅방에 현재 참여자 수나 목록 표시하기)
                number: socket.adapter.rooms[roomId].length,    
            });
            // [11.4 : 16.] (socket에 express-session 적용) END --
            */
           //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) [작업을 위해 주석처리] END


           //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) START
            axios.post(`http://localhost:8005/room/${roomId}/sys`, {
                type: 'join',   // [ME] 시점이 socket의 join 이벤트 발생시인듯?
            }, {
                headers: {
                    // [ME] 암호화된 쿠키 connect (유저 중복을 막기위해 cookie-signature 적용)
                    Cookie: `connect.sid=${'s%3A' + cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET)}`,
                },  
            });
           //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) END

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);   // 채팅방에서 나가는 메서드 (접속 해제 시)
            
            // [11.4 : 16.] (socket에 express-session 적용) START --
            //- 접속 해제 시, 현재 방의 사람 수를 구해서 참여자 수가 0명이면 방을 제거하는 HTTP 요청을 보냄
            const currentRoom = socket.adapter.rooms[roomId];   // 참여중인 소켓정보가 들어있음
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {  // 0명이면 방 삭제
                axios.delete(`http://localhost:8005/room/${roomId}`)
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {    // 남은 참여자가 0명이 아니면, 누가 나갔는지 퇴장했다는 데이터를 보냄
                /*
                //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) [작업을 위해 주석처리] START
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,

                    // [11.6.1 : 01.] (채팅방에 현재 참여자 수나 목록 표시하기)
                    number: socket.adapter.rooms[roomId].length,    
                });
                //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) [작업을 위해 주석처리] END ----
                */

                //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) START
                axios.post(`http://localhost:8005/room/${roomId}/sys`, {
                    type: 'exit',
                }, {
                    headers: {
                        // 암호화된 쿠키 connect.sid
                        Cookie: `connect.sid=${'s%3A' + cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET)}`,
                    },
                });
                //- [11.6.1 : 02.] (시스템 메시지까지 DB에 저장하기) END
            }
            // [11.4 : 16.] (socket에 express-session 적용) END --
        });


        // [11.5 : Note_2)] 라우터를 거치지 않고 채팅 구현 (웹 소켓만으로 채팅 구현) START
        /*
        socket.on('chat', (data) => {
            socket.to(data.room).emit(data);
        });
        */
        // [11.5 : Note_2)] 라우터를 거치지 않고 채팅 구현 (웹 소켓만으로 채팅 구현) END
    });
};