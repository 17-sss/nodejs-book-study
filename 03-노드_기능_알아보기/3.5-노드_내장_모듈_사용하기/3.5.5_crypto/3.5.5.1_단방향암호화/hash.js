// [3.5.5] crypto 
// [3.5.5.1] : hash.js
// 단방향 암호화: 복호화할 수 없는 암호화 방식을 뜻함.
const crypto = require('crypto');

console.log('base64:', crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex:', crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64:', crypto.createHash('sha512').update('다른 비밀번호').digest('base64'));

/* 
    createHash(알고리즘): 사용할 해시 알고리즘을 넣음 
        - md5, sha1, sha256, sha512 등 가능하지만 md5와 sha1은 이미 취약점 발견
        - sha512로 현재로썬 충분
            ▷ sha512가 취약점이 있다면, sha3으로 이전하면 됨.
    update(문자열): 변환할 문자열을 넣어줌
    digest(인코딩): 인코딩할 알고리즘을 넣어줌. 결과물로 반환된 문자열을 반환함
        - base64, hex, latin1이 주로 사용됨. 그중 base64가 결과 문자열이 가장 짧아 애용됨
*/