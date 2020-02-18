// [3.6.1] 동기 메서드와 비동기 메서드
    // 비동기 - 논블로킹 : 순서유지
const fs = require('fs');

console.log('시작');
fs.readFile('./readme2.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('1번', data.toString());

    fs.readFile('./readme2.txt', (err, data) => {
        if(err) {
            throw err;
        }
        console.log('2번', data.toString());

        fs.readFile('./readme2.txt', (err, data) => {
            if(err) {
                throw err;
            }
            console.log('3번', data.toString());
        });
    });
});
console.log('끝');