// [2.1.5] 비구조화 할당
/* 
    이름은 어색하지만 매우 유용한 기능. 
    객체와 배열로부터 속성이나 요소를 쉽게 꺼낼 수 있음 
*/

// 1. 객체의 속성을 같은 이름의 변수에 대입하는 코드 (일반 구조)
var candyMachine = {
    status: {
        name: 'node',
        count: 5
    },
    getCandy: function() {
        this.status.count--;
        return this.status.count;
    }
};

// me, normal.. 일일이 할당
var getCandy = candyMachine.getCandy;
var count = candyMachine.status.count;

// == 이를 다음▼과 같이 바꿀 수 있음. --------------

// 1-1. 위 1.을 비구조화 할당 (비구조화 할당)
const candyMachine = {
    status: {
        name: node,
        count: 5,
    },
    getCandy() {
        this.status.count--;
        return this.status.count;
    }
};
// me, 비구조화 할당
/* candyMachine 객체 안의 속성을 찾아서 변수와 매칭해줌
    count처럼 여러 단계 안의 속성도 찾을 수 있음.   */
const {getCandy, status: {count}} = candyMachine;

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

// 2. 배열 비구조화 할당 (일반 구조)
var array = ['nodejs', {}, 10, true];
var node = array[0];
var obj = array[1];
var bool = array[3];

// 2-1. 배열 비구조화 할당 (비구조화 할당)
/* array란 배열의 첫번째, 두번째 요소와 마지막 요소를 변수에 대입하는 코드 */
const array = ['nodejs', {}, 10, true];
const [node, obj, , bool] = array;
