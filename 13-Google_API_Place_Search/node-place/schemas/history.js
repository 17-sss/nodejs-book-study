// [13.1] (검색 내역 스키마)
const mongoose = require('mongoose');

const { Schema } = mongoose;
const historySchema = new Schema({
    // 검색어
    query: {
        type: String,
        required: true,
    },
    // 생성 시간
    createdAt: {
        type: String,
        default: Date.now(),
    },
});

module.exports = mongoose.model('History', historySchema);