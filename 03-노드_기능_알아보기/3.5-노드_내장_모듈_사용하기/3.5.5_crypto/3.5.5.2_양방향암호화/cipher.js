// [3.5.5] crypto
// [3.5.5.2] : cipher.js
// 양방향 암호화 : 암호화 된 문자열을 복호화할 수 있음.

// [!!] cmd에서 deprecated 뜨는 걸로봐선.. 더 이상 사용하지 않나봄.

const crypto = require('crypto');
const cipher = crypto.createCipher('aes-256-cbc', '열쇠');
let result = cipher.update('암호화할 문장', 'utf8', 'base64');
result += cipher.final('base64');
console.log('암호화:', result);

const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
let result2 = decipher.update(result, 'base64', 'utf8');
result2 += decipher.final('utf8');
console.log('복호화:', result2);

/* 
    <== 암호화 cipher ==>
    * crypto.createCipher (알고리즘, 키): 암호화 알고리즘과 키를 넣음
        사용가능한 알고리즘 리스트는: crypto.getCiphers() 쓰면 리스트 나옴
    * cipher.update(문자열, 인코딩, 출력 인코딩) : 암호화할 대상과 대상의 인코딩, 출력 결과물의 인코딩을 넣어줌
    * cipher.final(출력 인코딩): 출력 결과물의 인코딩을 넣어주면 암호화가 완료
    
    <== 복호화 decipher ==>
    * crypto.createDecipher(알고리즘, 키): 복호화할 때 사용
    * decipher.update(문자열, 인코딩, 출력 인코딩): 암호화된 문장, 그 문장의 인코딩, 복호화할 인코딩을 넣어줌
    * decipher.final(출력 인코딩): 복호화 결과물의 인코딩을 넣어줌
*/
