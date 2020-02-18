// [3.7] 이벤트 이해하기
const EventEmitter = require('events');

const myEvent = new EventEmitter();

// * addListener(이벤트명, 콜백): on과 기능 같음
myEvent.addListener('event1', () => {   
    console.log('이벤트 1');
});

// * on(이벤트명, 콜백): 이벤트 이름과 이벤트 발생 시 콜백을 연결해줌.
    // 이렇게 연결하는 동작을 이벤트 리스닝이라 부름
    // 이벤트 하나에 이벤트 여러개를 달아줄 수도 있음.
myEvent.on('event2', () => {
    console.log('이벤트 2');
});

myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
});

// * emit(이벤트명): 이벤트를 호출하는 메서드
myEvent.emit('event1');
myEvent.emit('event2');

// * once(이벤트명, 콜백): 한 번만 실행되는 이벤트
    // 아래에서 두번 연속 호출했지만 한 번만 실행됨.
myEvent.once('event3', () => {
    console.log('이벤트 3');
});

myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('event4', () => {
    console.log('이벤트 4');
});
// * removeAllListeners(이벤트명): 이벤트에 연결된 모든 이벤트 리스너를 제거
myEvent.removeAllListeners('event4');
myEvent.emit('event4');

const listener = () => {
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
// * removeListener(이벤트명, 리스너): 이벤트에 연결된 리스너를 하나씩 제거
// * off(이벤트명, 콜백): 노드 10버전에서 추가. removeListener와 기능 같음
myEvent.removeListener('event5', listener);
myEvent.emit('event5');

// * listenerCount(이벤트명): 현재 리스너가 몇 개 연결되어 있는지 확인
console.log(myEvent.listenerCount('event2'));

