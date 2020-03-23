// [10.6]
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');   // [10.7 : 4] 
const url = require('url'); // [10.7 : 5]

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// router.use(cors());     // [10.7 : 4]
// [10.7 : 5] START
router.use(async (req, res, next) => {
    const domain = await Domain.find({
        where: { host: url.parse(req.get('origin')).host },
    });
    if (domain) {
        cors({origin: req.get('origin')})(req, res, next); 
        /* 
            + cors({origin: req.get('origin')})(req, res, next); 
                - (req, res, next) 인자를 직접 주어 호출. 
                    이 방법은 미들웨어의 작동 방식을 커스터마이징하고 싶을 때 하는 방법
                ▼ 코드와 같다 보면 됨
                ------------------------------------------------
                |    router.use(cors());                       |
                |                                              |
                |   router.use((req, res, next) => {           |
                |        cors()(req, res, next);               |
                |    })                                        |
                ------------------------------------------------
        */
    } else {
        next();
    }
});
// [10.7 : 5] END

router.post('/token', apiLimiter, async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.find({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });

        if(!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }

        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',   // 30분
            issuer: 'nodebird',
        });

        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
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

router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
    Post.findAll({ where: {userId: req.decoded.id} })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async(req, res) => {
    try {
        const hashtag = await Hashtag.find({ where: {title: req.params.title} });
        if(!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }

        const posts = await hashtag.getPosts();
        return res.json({
            code:200,
            payload: posts,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

module.exports = router;