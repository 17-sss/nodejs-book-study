// [3.6.2] 버퍼와 스트림 이해하기
// 파일을 읽은 후 gzip 방식으로 압축하는 코드 예제

const zlib = require('zlib');
const fs = require('fs');

const readStream = fs.createReadStream('./readme4.txt');
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./readme4.txt.gz');

readStream.pipe(zlibStream).pipe(writeStream);  
/* 
    [?!] zlib의 createUnzip()이라는 메서드가 스트림을 지원하므로
        readStream과 writeStream 중간에서 파이핑을 할 수 있음. 
*/


