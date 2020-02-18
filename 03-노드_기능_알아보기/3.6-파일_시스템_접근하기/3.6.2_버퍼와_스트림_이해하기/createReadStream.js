// [3.6.2] 버퍼와 스트림 이해하기
const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt', {highWaterMark: 16});
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data:', chunk, chunk.length);
});

readStream.on('end', () => {
    console.log('end:', Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
    console.log('error:', err);
});

/* 
    - fs.createReadStream의 첫번째 인자는 읽을 파일경로, 두번째 인자는 옵션
        highWaterMark라는 옵션이 버퍼의 크기(바이트 단위)를 정할 수 있는 옵션임. 기본값은 64(64KB)
    - readStream은 이벤트 리스너를 붙여서 사용. 보통 'data', 'end', 'error' 이벤트를 사용
*/
