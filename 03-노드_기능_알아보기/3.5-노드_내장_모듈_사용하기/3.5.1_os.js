// [3.5] 노드 내장 모듈 사용하기
// [3.5.1] os
const os = require('os');


console.log('***************운영체제 정보***************',
    '\n' + 'os.arch(): ', os.arch(),
    '\n' + 'os.platform(): ', os.platform(),
    '\n' + 'os.type(): ', os.type(),      // 운영체제의 종류
    '\n' + 'os.uptime(): ', os.uptime(),  // 운영체제 부팅 이후 흐른 시간을 보여줌. process.uptime()은 노드의 실행 시간임.
    '\n' + 'os.hostname(): ', os.hostname(),
    '\n' + 'os.release(): ', os.release(),    // 운영체제의 버전을 보여줌
    
    '\n\n' + '****경로****',
    '\n' + 'os.homedir(): ', os.homedir(),
    '\n' + 'os.tmpdir(): ', os.tmpdir(),

    '\n\n' + '****cpu 정보****',
    'os.cpus(): ', os.cpus(),
    'os.cpus().length: ', os.cpus().length,    // 코어의 갯수

    '\n\n' + '****메모리 정보****',
    '\n' + 'os.freemem(): ', os.freemem(),
    '\n' + 'os.totalmem(): ', os.totalmem(),
);