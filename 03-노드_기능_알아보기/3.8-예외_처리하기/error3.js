// [3.8] 예외 처리하기
// 예제: 예측이 불가능한 에러를 처리하는 방법

process.on('uncaughtException', (err) => {  
    console.error('예기치 못한 에러', err);
});

setInterval(() => {
   throw new Error('서버를 고장내주마!');   // 에러 강제 발생
}, 1000);

setTimeout(() => {
   console.log('setTimeout 실행됩니다.') 
}, 2000);

/* 
    - process 객체에 'uncaughtException' 이벤트 리스너 달아줌. 
        처리하지 못한 에러가 발생했을 때 이벤트 리스너가 실행되고 프로세스가 유지됨.
        이 부분이('uncaughtException') 없다면 setInterval에서 에러가 발생하여 프로세스가 멈춤.

    - 하지만, 노드 공식 문서에서는 uncaughtException 이벤트를 최후의 수단으로 사용하라고 말함.
        노드는 uncaughtException 이벤트 발생 후 다음 동작이 제대로 동작하는지 보증하지 않음.
        따라서, 단순히 에러 내용을 기록하는 정도로 사용하고 process.exit()로 프로세스를 종료하는것이 좋음
        
        ▷ Me, 프로세스를 종료하면 서버가 멈추어 걱정되겠지만, 재시작하는 방법이 있음. 걱정 ㄴㄴ
*/