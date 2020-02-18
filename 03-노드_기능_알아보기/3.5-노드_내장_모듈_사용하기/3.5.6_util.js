// [3.5.6] util: 각종 편의 기능을 모아둔 모듈
// 가끔 deprecated 되어 사라지는 경우도 있음.

// deprecated란, '중요도가 떨어져 더 이상 사용되지 않고 앞으로는 사라지게 될 것'이라는 뜻

const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate(
    (x, y) => {
        console.log(x + y);
    }, 
    'dontUseMe 함수는 deprecated 되었으니 더 이상 사용하지 마세요!'
);
dontUseMe(1, 2);

/* 
    util.deprecate: 
        함수가 deprecated 처리되었음을 알려줍니다. 
        첫 번째 인자로 넣은 함수를 사용했을 때 경고 메시지가 출력되고,
        두 번째 인자로 표시할 경고 메시지 내용을 넣으면 됩니다.

*/

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
    .then((buf) => {
        console.log(buf.toString('base64'));
    })
    .catch((error)=> {
        console.error(error);
    });

/*
    util.promisify: 
        콜백 패턴을 프로미스 패턴으로 바꿔줍니다. 
        바꿀 함수를 인자로 제공하면 됩니다. 
        이렇게 바꾸어두면 async/await 패턴까지 사용할 수 있어 좋습니다
*/    


