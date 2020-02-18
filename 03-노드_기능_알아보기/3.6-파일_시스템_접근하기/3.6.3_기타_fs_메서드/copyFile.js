// [3.6.3] 기타 fs 메서드
const fs = require('fs');

fs.copyFile('readme_Main.txt', 'write_copyFile.txt', (error) => {
    if (error) {
        return console.error(error);
    }
    console.log('복사 완료');
});