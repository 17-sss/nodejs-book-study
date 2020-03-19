// [10.3] START
const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// 토큰을 발급하는 라우터
router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.find({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        
        if (!domain) {
            return req.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            // * 첫번째 인자: 토큰의 내용
            id: domain.user.id,
            nick: domain.user.nick,
        }, 
        process.env.JWT_SECRET, // * 두번째 인자: 토큰의 비밀키
        {   // * 세번째 인자: 토큰의 설정
            expiresIn: '1m',    // 1분 (유효기간)
            issuer: 'nodebird', // 발급자
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

// 사용자가 토큰을 테스트해볼수 있는 라우터
router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});
// [10.3] END


// [10.5] START
/* 
    아래 2개의 라우터처럼 사용자에게 제공해도 되는 정보를 API로 만들면 됨.
*/

// 내가 올린 포스트를 가져오는 라우터
router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({where: { userId: req.decoded.id }})
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch( (error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

// 해시태그 검색 결과를 가져오는 라우터
router.get('/posts/hashtag/:title', verifyToken, async(req, res) => {
    try {
        const hashtag = await Hashtag.find({where: {title: req.params.title }});
        if(!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });    
    }
});
// [10.5] END

module.exports = router;