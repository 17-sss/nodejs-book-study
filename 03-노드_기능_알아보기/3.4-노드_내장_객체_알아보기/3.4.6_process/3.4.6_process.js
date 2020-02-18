// [3.4.6] process
/*  REPL

    λ node
    > process.version
    'v10.16.0'  // 설치된 노드의 버전
    > process.arch
    'x64'       // 프로세서 아케텍쳐 정보, arm이나 ia32 등의 값일 수도 있습니다.
    > process.platform
    'win32'     // 운영체제 플랫폼 정보,  linux나 darwin, freebsd 등의 값일 수도 있습니다.
    > process.pid
    16152       // 현재 프로세스의 아이디. 프로세스를 여러 개 가질 때 구분 가능
    > process.uptime()
    38.717      // 프로세스가 시작된 후 흐른 시간. 단위는 초
    > process.execPath
    'C:\\Program Files\\nodejs\\node.exe'   // 노드의 경로
    > process.cwd()
    'f:\\_Study_Other       // 현재 프로세스가 실행되는 위치
    > process.cpuUsage()
    { user: 109000, system: 156000 }    // 현재 cpu 사용량

*/