// [3.6.2] 버퍼와 스트림 이해하기

const fs = require('fs');
const readStream = fs.createReadStream('./readme4.txt');
const writeStream = fs.createWriteStream('./writeme3.txt');
readStream.pipe(writeStream);


/* 
    - 위 코드처럼, 읽기 스트림(readStream)과 쓰기 스트림(writeStream)을 
        만들어둔 후 두 개의 스트림 사이를 pipe 메서드로 연결해주면 
        저절로 데이터가 writeStream으로 넘어감.
        ▶ readme4.txt와 똑같은 내용의 writeme.txt가 생성됨

    - pipe 메소드는 스트림 사이에 연결할 수 있음.

    Me, 'readStream의 데이터를 pipe하다 writeStream으로' 이런 느낌.
*/