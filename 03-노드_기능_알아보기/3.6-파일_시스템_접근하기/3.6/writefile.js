// [3.6] 파일 시스템 접근하기

const fs = require('fs');

// var strFileName = './writeme.txt';  // Me, Custom

fs.writeFile('./writeme.txt', '글이 입력됩니다', (err) => {
// fs.writeFile(strFileName, '글이 입력됩니다', (err) => {   // Me, Custom
    if(err){
        throw err;
    }
    fs.readFile('./writeme.txt', (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data.toString());
    })
});