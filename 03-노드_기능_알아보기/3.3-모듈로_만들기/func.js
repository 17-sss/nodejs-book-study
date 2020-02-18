// import { odd, even } from './var';   // me, ES6 모듈
const {odd, even} = require('./var');   // me, commonJS 모듈 | 책에 이렇게 기재되어있음.

function checkOddOrEven(num) {
    if (num % 2) {  // 홀수일 경우 (나머지가 0이 아닐 경우)
        return odd;
        // me, return된 시점에서 이 function은 동작 끝!
    }
    return even;
};
module.exports = checkOddOrEven;
// export default checkOddOrEven; // me, ES6 모듈
