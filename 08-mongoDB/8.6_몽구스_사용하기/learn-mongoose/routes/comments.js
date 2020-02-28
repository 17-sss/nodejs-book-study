// [8.6.3]
var express = require('express');
var Comment = require('../schemas/comment');

var router = express.Router();

// 다큐먼트 조회
router.get('/:id', (req, res, next) => {
    Comment.find({commenter: req.params.id}).populate('commenter')
        .then((comments) => {
            console.log(comments);
            res.json(comments);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        }); 
});

// 다큐먼트 등록
router.post('/', (req, res, next) => {
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    comment.save()
        .then((result) => {
            return Comment.populate(result, { path: 'commenter'});
        })
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

// 다큐먼트 수정
router.patch('/:id', (req, res, next) => {
    Comment.update( {_id: req.params.id}, {comment: req.body.comment})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

// 다큐먼트 삭제
router.delete('/:id', (req, res, next) => {
    Comment.remove( {_id: req.params.id} )
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

module.exports = router;