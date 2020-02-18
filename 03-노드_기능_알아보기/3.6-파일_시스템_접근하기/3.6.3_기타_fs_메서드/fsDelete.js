// [3.6.3] 기타 fs 메서드

const fs = require('fs');

fs.readdir('./folder', (err, dir) => {
    if (err) {
        throw err;
    }
    console.log('폴더 내용 확인', dir);

    fs.unlink('./folder/newfile.js', (err) => {
        if (err) {
            throw err;
        }
        console.log('파일 삭제 성공');

        fs.rmdir('./folder', (err) => {
            if (err) {
                throw err;
            }
            console.log('폴더 삭제 성공');
        });
    });
});

/* 
    * fs.readdir(경로, 콜백): 폴더 안의 내용물을 확인할 수 있음.
    * fs.unlink(경로, 콜백): 파일을 지울 수 있음   
        - 파일이 없다면 에러 발생. 먼저 파일이 있는지 꼭 확인
    * fs.rmdir(경로, 콜백): 폴더를 지울 수 있음.
        - 폴더 안에 파일이 있다면 에러가 발생. 먼저 내부 파일을 모두 지우고 호출
*/