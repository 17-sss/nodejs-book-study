// [8.6.3] 
// async / await Ver
const express = require('express');
const Comment = require('../../schemas/comment');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const comments = await Comment.find({commenter: req.params.id}).populate('commenter');    
        console.log(comments);
        res.json(comments);
    } catch (error) {
        console.log(error);
        next(error);
    }    
});

router.post('/', async (req, res, next) => {
    const comment = new Comment({
        commenter: req.body.id, 
        comment: req.body.comment,
    });

    // async/await 문법으로 변환시도. 일단 보류.
    // Promise 외 몇가지에 대해 개념이 부족함.

    // 참고:  https://www.zerocho.com/category/ECMAScript/post/58d142d8e6cda10018195f5a

    /*
    try {
        const result = await comment.save();
        return Comment.populate(result, { path: 'commenter'});
    } catch (error) {
        
    }
    */
})