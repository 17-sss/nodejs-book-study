// [4.5] cluster
// cluster 모듈은 싱글 스레드인 노드가 CPU코어를 모두 사용할 수 있게 해주는 모듈
/* 
    [1]
    - 포트를 공유하는 노드 프로세스를 여러 개 둘 수도 있어 요청이 많이 들어왔을 때
      병렬로 실행된 서버의 개수만큼 요청이 분산되게 할 수 있음.
        
      ▷ ex) 코어가 8개인 서버가 있을 때, 노드는 보통 코어 하나만 활용하지만
        cluster 모듈을 사용하여 코어 하나당 노드 프로세스 하나가 돌아가게 할 수 있음

    [2]
    - 세션을 공유하지 못하는 단점이 있음. 이는 Redis 등의 서버를 도입하여 해결 가능
*/

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const nPortNum = 8085;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    
    // CPU 개수만큼 워커를 생산
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        cluster.fork(); // 이 행을 추가함으로써 워커 프로세스가 종료되었을때 다시 하나 생성
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Cluster!</p>');

        setTimeout(() => {
           process.exit(1);
        }, 1000);

    }).listen(nPortNum, () => {
        // http://localhost:8085
        console.log(`${process.pid}번 워커 실행`);
    });    
}