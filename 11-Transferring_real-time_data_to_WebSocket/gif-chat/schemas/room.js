// [11.4] (채팅방 스키마)
const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
    title: {            // 방 제목
        type: String,
        required: true,
    },
    max: {              // 최대 수용 인원
        type: Number,
        required: true,
        defaultValue: 10,   //- 수용인원은 기본적으로 10명
        min: 2,             //- 최소 2명 이상으로 설정
    },
    owner: {            // 방장
        type: String,
        required: true,
    },
    password: String,   // 비밀번호(비번 설정하면 비밀방, 아니라면 공개방)
    createdAt: {        // 생성 시간
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);
