// [11.4 : 17.] (생성)
const express = require('express');

// [11.6 : 02.] (GIF 이미지 전송 구현) START
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// [11.6 : 02.] (GIF 이미지 전송 구현) END

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

//- 채팅방 목록이 보이는 메인 화면을 렌더링하는 라우터 (get('/'))
router.get('/', async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError')});
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//- 채팅방 생성화면을 렌더링하는 라우터 (get('/room'))
router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성'});
});

//- 채팅방을 만드는 라우터 (post('/room'))
router.post('/room', async (req, res, next) => { // 1
    try {
        const room = new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });

        const newRoom = await room.save();

        // app.set('io', io)로 저장했던 io객체를 req.app.get('io')로 가져옴
        const io = req.app.get('io');
        
        // io.of('/room').emit 메서드는 /room 네임스페이스에 연결한 모든 클라이언트에게 데이터를 보내는 메서드
        //+ 네임스페이스가 따로 없는 경우, io.emit 메서드로 모든 클라이언트에게 데이터를 보낼 수 있음.
        io.of('/room').emit('newRoom', newRoom);

        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//- 채팅방을 렌더링하는 라우터 (get('/room/:id))
/* 
    + 렌더링 전에 방이 존재하는지, 비밀방인 경우 비번이 맞는지, 허용인원 초과하지 않았는지 검사.
        io.of('/chat').adapter.rooms에 방목록이 들어있음.
        io.of('/chat').adapter.rooms[req.parms.id]를 하면 해당 방의 소켓 목록이 나옴.
            => 이것으로 소켓의 수를 세서 참가인원 수를 알아낼수 있음
*/
router.get('/room/:id', async (req, res, next) => { // 2
    try {
        const room = await Room.findOne({_id: req.params.id});
        const io = req.app.get('io');
        if (!room) {
            req.flash('roomError', '존재하지 않는 방입니다.');
            return res.redirect('/');
        }
        if (room.password && room.password !== req.query.password) {
            req.flash('roomError', '비밀번호가 틀렸습니다.');
            return res.redirect('/');
        }

        const { rooms } = io.of('/chat').adapter;
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            req.flash('roomError', '허용인원이 초과하였습니다.');
            return res.redirect('/');
        }

        const chats = await Chat.find({room: room._id}).sort('createdAt'); // [11.5 : 02.] 
        /* 
            [11.5 : 02.] 방 접속 시 기존 채팅내역을 불러옴.
            방 접속 시에는 DB로부터 채팅 내역을 가져오고, 접속 후에는 웹 소켓으로 새로운 채팅 메세지를 받음
        */

        return res.render('chat', {
            room,
            title: room.title,
            // chats: [],
            chats, // [11.5 : 02.] 
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

//- 채팅방을 삭제하는 라우터 (delete('/room/:id'))
router.delete('/room/:id', async(req, res, next) => {   // 3
    try {
        await Room.remove({_id: req.params.id});
        await Chat.remove({room: req.params.id});
        res.send('ok');

        setTimeout(() => {
           req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// [11.5 : 02.] START 
// + chat.pug의 전송 버튼을 누르면 작동.
router.post('/room/:id/chat', async (req, res, next) => {
    try {   
        // 1) 채팅을 데이터 베이스에 저장한 후..
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        });
        await chat.save();

        // 2) io.of('/chat').to(방 아이디).emit으로 같은 방에 들어 있는 소켓들에게 메시지 데이터를 전송
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// [11.5 : 02.] END

// [11.6 : 02.] (GIF 이미지 전송 구현) START
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 *1024},
});

router.post('/room/:id/gif',  upload.single('gif'), async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            gif: req.file.filename,
        });

        await chat.save();

        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// [11.6 : 02.] (GIF 이미지 전송 구현) END


module.exports = router;