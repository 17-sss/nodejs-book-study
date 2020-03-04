// [8.6.2]
const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },  // name 필드: String, 필수 값, 고유한 값이어야 
    age: {
        type: Number,
        required: true,
    },  // age 필드: Number, 필수 값
    married: {
        type: Boolean,
        required: true,
    },  // married 필드: Boolean, 필수 값
    comment: String, // comment 필드: String
    createdAt: {
        type: Date, 
        default: Date.now, 
    },  // createdAt 필드: Date, 기본값 지정
});

module.exports = mongoose.model('User', userSchema);