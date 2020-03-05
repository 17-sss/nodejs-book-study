// [9.3.2]
const kakaoStrategy = require('passport-kakao').Strategy;

const {
    User
} = require('../models');

module.exports = (passport) => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: './auth/kakao/callback',
        /* 
            + clientID는 카카오에서 발급해주는 아이디 (APP ID), 
                노출되지 않아야 하므로 .env 설정
            + callbackURL는 카카오로부터 인증 결과를 받을 라우터 주소
        */
    }, 

    async (accessToken, refreshToken, profile, done) => {    
        try {
            const exUser = await User.find({
                where: {
                    snsId: profile.id,
                    provider: 'kakao'
                }
            });
            // 기존에 카카오로 로그인한 사용자가 있는지 조회
            if (exUser) {
                done(null, exUser);
            // 없을 경우 회원가입 진행
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });

                /* 
                    + 카카오에서는 인증 후 callbackURL에 적힌 주소로
                        accessToken, refreshToken, profile을 보내줌
                        - profile 객체를 console.log로 확인해보는 것이 좋음.
                            (원하는 정보를 넣을 때 나중에 활용도?)                
                */
                console.log(profile);   // ME, Custom

                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};