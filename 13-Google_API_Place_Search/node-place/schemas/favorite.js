// [13.1]   (즐겨찾기 스키마)
const mongoose = require('mongoose');

const { Schema } = mongoose;
const favoriteSchema = new Schema({
    // 장소 아이디
    placeId: {
        type: String,
        unique: true,
        required: true,
    },
    // 장소명
    name: {
        type: String,
        required: true,
    },
    // 좌표
    location: {
        type: [Number], // 경도와 위도 정보가 배열로 들어감 
        index: '2dsphere',  // 위치정보를 저장하겠다는 의미
    },
    // 생성 시간
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Favorite', favoriteSchema);