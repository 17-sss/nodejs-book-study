// [10.6]
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');   // [10.7 : 4] 
const url = require('url'); // [10.7 : 5]

const { verifyToken, apiLimiter, premiumApiLimiter } = require('./middlewares');
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

// [10.8.1] START -------------------------------------------------------
// 2. 무료인 도메인과 프리미엄 도메인 간 사용량 제한 다르게 적용하기
/* 
    ++ 이 구간 수정하기 전에
        router.post('/token', apiLimiter, async (req, res) => {..} 
        이런 식으로 apiLimiter 미들웨어가 라우터에 적용되어 있었음 

        이 구간을 수정함으로써, 모든 라우터에 걸려있던 미들웨어 apiLimiter를 제거하고
        Domain의 type을 확인 후 값에 해당하는 미들웨어를 use 함
        (apiLimiter OR premiumApiLimiter)
*/
router.use(async (req, res, next) => {
    const domain = await Domain.find({
        where: { host: url.parse(req.get('origin')).host  },
    });

    if (domain.type === 'free') {
        apiLimiter(req, res, next);
    } else {
        premiumApiLimiter(req, res, next);
    }
});
// [10.8.1] END -------------------------------------------------------


router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.find({
            where: { clientSecret: clientSecret },  // [10.8.1] - 3 START
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

router.get('/test', verifyToken, (req, res) => {
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

router.get('/posts/hashtag/:title', verifyToken, async(req, res) => {
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

// [10.8.1] START -------------------------------------------------------
// 1. 팔로워나 팔로잉 목록을 가져오는 API 만들기
router.get('/follow/:opt', verifyToken, async (req, res, next) => {
    try {
        const opt = req.params.opt;
        if (opt !== 'friend' && opt !== 'me') {
            return res.status(404).json({
                code: 404,
                message: '잘못된 요청입니다.',
            });
        }

        const user = await User.find({where: {id: req.decoded.id},});
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: '기준이 되는 유저의 정보가 없습니다.',
            });
        } 
        
        let follow;

        if (opt === 'me') {
            follow = await user.getFollowers();
        } else if (opt === 'friend') {
            follow = await user.getFollowings();            
        }

        if (!follow) {    
            return res.status(404).json({
                code: 404,
                message: '정보를 가져올 수 없습니다.',
            });
        } else {
            return res.status(200).json({
                code: 200,
                payload: follow,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});
// [10.8.1] END -------------------------------------------------------

module.exports = router;