// [8.6.2]
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User',    // commenter 필드에 User 스키마의 사용자 ObjectId가 들어간다는 뜻
    },
    comment: {
        type: String,
        required: true,        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);