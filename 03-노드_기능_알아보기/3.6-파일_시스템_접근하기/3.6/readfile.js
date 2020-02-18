// [3.6] 파일 시스템 접근하기

const fs = require('fs');

fs.readFile( './readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data);
    console.log(data.toString());
});