const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    Post,
    Hashtag,
    User
} = require('../models');
const {
    isLoggedIn
} = require('./middlewares');

const router = express.Router();

// [1] 이미지 업로드 폴더 확인 후, 없으면 생성 | -----------
fs.readdir('uploads', (error) => {  
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});
// -------------------------------------------------- [1]


// [2] multer 모듈 설정 | -----------
const upload = multer({
    // 1. storage는 파일 저장 방식과 경로, 파일명 등을 설정할 수 있음. (여기선  diskStorage룰 사용해 이미지가 서버 디스크에 저장되도록 함.)
    storage: multer.diskStorage({
        // diskStorage의 destination 메서드: 저장 경로를 nodebird 폴더 아래 uploads 폴더로 지정
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        /* diskStorage의 filename 메서드:  
            기존 이름(file.originalname)에 업로드 날짜 값(new Date().valueOf())과
            기존 확장자(path.extname)를 붙이도록 설정.
            (업로드 날짜를 붙이는건. 파일명이 중복되지 않게하기 위함)
        */
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
            // cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 4쇄용 코드
        },
    }),
    // 2. limits 속성은 최대 이미지 파일 용량 허용치를 의미 (바이트 단위)
    limits: {
        fileSize: 5 * 1024 * 1024
    },

/*
    ★★★★★

    * upload (multer) 변수의 미들웨어를 만드는 여러가지 메서드 - single, array, fields, none
        1) single
            + 하나의 이미지를 업로드할 때 사용. req.file 객체를 생성     
            ▷ 이미지 하나는 req.file로  |   나머지 정보는 req.body로 
            
        2) array와 fields
            + 여러 개 이미지를 업로드할 때 사용, req.files 객체를 생성
            [!] array와 fields 차이점
                + 이미지를 업로드한 body 속성의 개수.
                    - 속성 하나에 이미지를 여러 개 업로드했다면 array를 사용. 
                    - 여러 개의 속성에 이미지를 하나씩 업로드했다면 fields를 사용.
            ▷ 이미지들은 req.files로  |   나머지 정보는 req.body로 
        3) none
            + 이미지를 올리지 않고 데이터만 multipart 형식으로 전송했을 때 사용.
            ▷ 모든 정보를 req.body로 
*/
});
// -------------------------------------------------- [2]


// [3] 이미지 업로드를 처리하는 라우터 (upload(multer)의 single 미들웨어 사용) | -----------
/* 
    - single 메소드엔 이미지가 담긴 req.body 속성의 이름을 적어줌.
        현재 이 앱에서 AJAX로 이미지를 보낼 때 속성 이름을 img로 하고 있음.
*/
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file); //single메서드가 이미지를 처리하고 req.file 객체에 결과 저장
    res.json({
        url: `/img/${req.file.filename}`
    });
});
// -------------------------------------------------- [3]

// [4] 게시글을 업로드 처리하는 라우터 (upload2(multer)의 none 미들웨어 사용) | -----------
/* 
    - 이미지를 업로드했다면 이미지 주소도 req.body.url로 전송됨.
        데이터 형식이 multipart지만 이미지 데이터가 들어 있지 않으므로 none 메서드 사용
        (이미지 주소가 온것이지 이미지 데이터가 온게 아님.)
*/
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        // 1) 게시글을 데이터베이스에 저장 후..
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });

   
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            // 2) 게시글 내용에서 해시태그를 정규표현식으로 추출 > 추출한 해시태그 데이터베이스에 저장 후..
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: {
                    title: tag.slice(1).toLowerCase()
                },
            })));
            // 3) post.addHashtags 메서드로 게시글과 해시태그 관계를 PostHashtag 테이블에 넣음
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// -------------------------------------------------- [4]


// [9.5]
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return  res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.find({
            where: {
                title: query
            }
        });
        
        let posts = [];
        
        if(hashtag) {
            posts = await hashtag.getPosts({
                include: [{model: User}]
            });
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
// --

module.exports = router;