// [3.5.5] crypto 
// [3.5.5.1] : pbkdf2.js 
// pbkdf2는 기존 문자열에 salt라고 불리는 문자열을 붙인 후 해시 알고리즘을 반복해서 적용하는 것

const crypto = require('crypto');
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'));
    });
});

/* 
    ** 위 randomBytes() 설명
    randomBytes() 메서드로 64바이트 길이의 문자열을 만들어줌. 이것이 salt가 됨.

    pbkdf2() 메서드에서는 순서대로 
    (비밀번호, salt, 반복횟수, 출력바이트, 해시 알고리즘)을 인자로 넣어줌
    예시에서는 10만번 반복해서 적용함.
    즉, sha512로 변환된 결과값을 다시 sha512로 변환하는 과정을 10만번 반복하는 것
        ▷ 너무 많이 반복하는 것 아닌가 걱정되겠지만, 1초 밖에 걸리지 않으며
            컴퓨터 성능에 따라 좌우됨. 조금 느리다 싶으면 반복횟수 낮추고
            빠르면 높이면됨.
*/