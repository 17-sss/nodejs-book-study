// [3.6.2] 버퍼와 스트림 이해하기

const fs = require('fs');

const writeStream = fs.createWriteStream('./writeme2.txt');
writeStream.on('finish', () => {
    console.log('파일 쓰기 완료');
});

writeStream.write('이 글을 씁니다.\n');
writeStream.write('한 번 더 씁니다.\n');
writeStream.end();  

/* 
    - fs.createWriteStream(출력 파일명, {옵션});
    - writeStream.on의 이벤트리스너 finish는 파일쓰기가 종료되면 콜백 함수가 호출
*/