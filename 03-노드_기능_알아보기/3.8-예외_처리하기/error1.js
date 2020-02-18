// [3.8] 예외 처리하기

// 예제: 프로세스가 멈추지 않도록 에러를 잡음
    // Me, 기본이지만.. 에러가 발생할거같은 부위는 try~catch 문으로 처리

setInterval(() => {
    console.log('시작');
    try {
        throw new Error('서버를 고장내주마!');  // 에러 강제로 발생시킴
        // throw를 하는 경우에는 반드시 try~catch문으로 throw한 에러를 잡아주어야함.
    } catch (error) {
        console.log(error);        
    }
    // Me, 위 처럼 에러발생 시 try~catch문 처리안하면 서버 멈춤
    
}, 1000);
