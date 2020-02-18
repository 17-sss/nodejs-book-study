// [3.4.6.1] process.fa-env
/* 
    REPL에 process.env를 입력하면 많은 정보가 출력되는데,
    자세히보면 시스템의 환경변수임.

    process.env는 서비스의 중요한 키를 저장하는 공간으로 사용됨
*/

// 중요한 정보인 비밀번호 등은 process.env 속성으로 대체
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE;
// ** 한 번에 모든 운영체제에 동일하게 넣을 수 있는 방법이 있다. (9장의 dotenv)