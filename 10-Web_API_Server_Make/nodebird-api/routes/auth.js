// [9.3.1]
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isNotLoggedIn, isLoggedIn} = require('./middlewares'); 
const { User } = require('../models');

const router = express.Router();

// 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) =>{ 
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.find( {where: {email} });

        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join'); 
        }
        const hash = await bcrypt.hash(password, 12);
        /*
            - bcrypt.hash의 두번째인자:
                pbkdf2의 반복횟수와 비슷한 기능.
                숫자가 커질수록 비밀번호를 알아내기 어려워지며 암호화 시간도 오래걸림.
                ** 12이상을 추천
        */
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');

    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next)=> { 
    passport.authenticate('local', (authError, user, info) => { // 미들웨어임
        if (authError) {
            console.error(authError);
            return next(authError);
        } 
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        } 
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);  // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임
    /*
        1. 미들웨어내에 미들웨어가 있는데, 보통 미들웨어에 사용자 정의 기능을 
            추가하고자 할 때 보통 이렇게 작업함.        
            (현재 라우터 미들웨어내에 passport 미들웨어가 있음)
        2. (passport의 코드) local 전략 코드
            1) 전략이 성공하거나 실패하면 authenticate 메서드의 콜백 함수가 실행.
                + 콜백함수의 첫번째 인자(authError) 값이 있다면 실패한것.
                + 두번째 인자 값이 있다면 성공한것이며, req.login 메서드를 호출.
                    - passport는 req 객체에 login, logout 메서드를 추가함.
                        req.login은 passport.serializeUser를 호출
                        ▷ req.login을 제공하는 user 객체가  serializeUser로 넘어감
    */
});

// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => { 
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


// [9.5.1] 스스로해보기 - 프로필 정보 변경하기 START ===
router.post('/update', isLoggedIn, async (req, res, next) =>{ 
    const { email, nick, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 12);
        const data = {
            email: email,
            nick: nick,
            password: hash,
        };
        await User.update(data, {
            where: {id: req.user.id}
        });
        return res.redirect('/profile');

    } catch (error) {
        console.error(error);
        return next(error);
    }
});
// [9.5.1] 스스로해보기 - 프로필 정보 변경하기 END ===

// [9.3.2 (카카오)] START 
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',   // 로그인 실패시
}), (req, res) => {
    res.redirect('/');      // 로그인 성공시
});
// [9.3.2 (카카오)] END

module.exports = router;
