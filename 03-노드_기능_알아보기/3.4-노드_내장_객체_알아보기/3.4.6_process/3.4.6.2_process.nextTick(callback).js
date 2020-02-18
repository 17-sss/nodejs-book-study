// [3.4.6.2] process.nextTick(콜백)
// 이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선으로 처리하도록 만듬.
setImmediate(()=> {
    console.log('immediate');   // 3
});

process.nextTick(() => {
    console.log('nextTick');    // 1
});

setTimeout(()=> {
    console.log('timeout');     // 3
}, 0);

Promise.resolve()
    .then(()=> {
        console.log('promise'); // 2
    });
/* 
    - resolve된 Promise도 nextTick처럼 다른 콜백보다 우선시됨
        me, process.nextTick 보단 아닌듯
    - process.nextTick과 Promise를 Microtask 라고 따로 구분지어 부름.
*/
