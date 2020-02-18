// [3.4.3] Timer
/* 
    [책 설명!]
        - setTimeout(콜백 함수, 밀리초): 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행
        - setInterval(콜백 함수, 밀리초): 주어진 밀리초마다 콜백 함수를 반복 실행합니다.
        - setImmediate(콜백 함수): 콜백 함수를 즉시 실행합니다.

        - clearTimeout(아이디(변수명)): setTimeout을 취소합니다.
        - clearInterval(아이디): setInterval을 취소합니다.
        - clearImmediate(아이디): setImmediate를 취소합니다.
*/
const timeout = setTimeout(()=> {
    console.log('1.5초 후 실행');
}, 1500);

const interval = setInterval( () => {
    console.log('1초마다 실행');
}, 1000);

const timeout2 = setTimeout(()=>{
    console.log('실행되지 않습니다.');
}, 3000) ;

setTimeout(() => {
    clearTimeout(timeout2);
    clearInterval(interval);
}, 2500);

const immediate = setImmediate(()=> {
    console.log('즉시 실행');     
    // me, 따로 안불러와도 진짜 즉시 실행됨!
    /*
        ** me, Add
        나머지도 같은 듯.. 이렇게 상수(const)에 대입해놨는데
        안불러와도 알아서 실행됨
    */   
});

const immediate2 = setImmediate(()=> { 
    console.log('실행되지 않습니다.');
});

clearImmediate(immediate2);

/* 
    * REPL 결과

    즉시 실행
    1초마다 실행
    1.5초 후 실행
    1초마다 실행
*/