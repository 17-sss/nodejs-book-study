const odd = '홀수입니다';
const even = '짝수입니다';

/* 
    - module.exports에 변수들을 담은 객체를 대입했음. (odd, even 등)
        이제 이 파일은 모듈로서 기능하며, 다른 파일에서 이 파일을 불러오면 
        module.exports에 대입된 값을 사용할 수 있음
*/
module.exports = {
    odd, 
    even,
};