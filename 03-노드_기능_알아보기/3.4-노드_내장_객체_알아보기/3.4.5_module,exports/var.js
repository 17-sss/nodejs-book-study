// [3.4.5]는 [3.3]의 var.js 수정하여 실습

/* ------------------
// [3.3] var.js
const odd = '홀수입니다';
const even = '짝수입니다';
*/

/* 
    - module.exports에 변수들을 담은 객체를 대입했음. (odd, even 등)
        이제 이 파일은 모듈로서 기능하며, 다른 파일에서 이 파일을 불러오면 
        module.exports에 대입된 값을 사용할 수 있음
*/
/*
module.exports = {
    odd, 
    even,
};
------------------ */ 

// [3.4.5] module, exports
    
exports.odd = '홀수입니다';
exports.even = '짝수입니다';

/* 
    module.exports와 exports는 동일하게 동작.
    module.expors와 exports가 같은 객체를 참조하기 때문.

    하지만.. exports 객체와 module.exports는 동시에 사용하지 말기.
*/
console.log(module.exports === exports);    // true


