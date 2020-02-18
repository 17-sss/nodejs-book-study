// [3.8] 예외 처리하기

// 예제: 노드 자체에서 잡아주는 에러.
    // Me, 아래 예제는 노드 자체에서 에러를 잡기에 try~catch가 없어도 멈추지 않음
const fs = require('fs');

setInterval(() => {
   fs.unlink('./abcdefg.js', (err) => {
        if (err) {
            console.error(err);
        }
   });
}, 1000);