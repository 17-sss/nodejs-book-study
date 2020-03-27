// [11.4] (채팅 스키마)
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: {ObjectId} } = Schema;
const chatSchema = new Schema({
    //- room 필드는 Room 스키마와 연결하여 Room 컬렉션의 ObjectId가 들어가게 됨.
    room: {         // 채팅방 아이디
        type: ObjectId,
        required: true,
        ref: 'Room',
    },
    user: {         // 채팅을 한 사람
        type: String,
        required: true,
    }, 
    /* 
        - chat 또는 img 필드에 require 속성이 없는 이유는 
            채팅 메세지나 GIF이미지 둘 중 하나만 저장하면 되기 때문
    */
    chat: String,   // 채팅 내역
    gif: String,    // GIF 이미지 주소
    createdAt: {    // 채팅 시간
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);

