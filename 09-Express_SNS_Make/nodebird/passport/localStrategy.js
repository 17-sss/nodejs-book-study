// [9.3.1]
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const {User} = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        /* 
            * LocalStrategy의 첫번째 인자.
                + 전략에 관한 설정을 하는 부분
                + usernameField와 passwordField에는 일치하는 req.body의 속성명을 적어주면 됨.
                    - req.body.email에 이메일, req.body.password에 비밀번호가 담겨오므로 각각 맞게 기재                               
        */
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        /* 
            * LocalStrategy의 두번째 인자 (실제 전략을 수행하는 async 함수)
                + 첫번째 인자에서 넣어준 email과 password는 
                    async 함수의 첫번째, 두번째 매개변수가 됨
                    세번째 매개변수인 done 함수는 passport.authenticate의 콜백 함수
        */
        try {
            const exUser = await User.find({
                where: {
                    email
                }
            });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                /* 
                    * bcrypt.compare 함수로 비밀번호를 데이터베이스의 비번과 비교한 뒤
                        + 비밀번호가 일치할 경우
                            - done 두번째 인자(exUser)로 사용자 정보를 넣어보냄
                                ▷ 두번째 인자를 사용하지 않을 경우는 로그인에 실패했을 때 뿐.    
                    *

                */
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, {
                        message: '비밀번호가 일치하지 않습니다.'
                    });
                }
            } else {
                done(null, false, {
                    message: '가입되지 않은 회원입니다.'
                });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};