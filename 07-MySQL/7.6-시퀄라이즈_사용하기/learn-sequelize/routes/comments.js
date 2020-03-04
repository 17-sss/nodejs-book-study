// router : comments (promise) (book)

// [7.6.5] START
var express = require('express');
var { User, Comment } = require('../models');

var router = express.Router();

router.get('/:id', (req, res, next) => {
    Comment.findAll({
        // include 쓰려면 models/index.js에 관계정의해줘야함.
        include: {
            model: User,
            where: { id: req.params.id },
        },
    })
        .then((comments) => {
            console.log(comments);
            res.json(comments);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.post('/', (req, res, next) => {
    Comment.create({
        commenter: req.body.id,
        comment: req.body.comment,
    })
        .then((result) => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.patch('/:id', (req, res, next) => {
    Comment.update( { comment: req.body.comment}, { where: {id: req.params.id} } )
        .then( (result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });            
});

router.delete('/:id', (req, res, next) => {
    Comment.destoy( {where: {id: req.params.id} })
        .then( (result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });        
});

module.exports = router;