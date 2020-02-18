// [2.1.4] 화살표 함수

// 1. 화살표 함수 예시
// add1, add2, add3, add4 같음
function add1(x, y) {
    return x + y;    
}
const add2 = (x,y) => {
    return x+y;
}
const add3 = (x,y) => x+y;
const add4 = (x,y) => (x+y);

// not1, not2 같음
function not1(x) {
    return !x;
}
const not2 = x => !x;


// 2. 기존 function와 다른점은 this 바인드 방식. 아래 예제 참조
// 1) 기존 function
var relationship1 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFriends: function() {
        var that = this;    // relationship1을 가리키는 this를 that에 저장
        this.friends.forEach(function (friend) {    // me, function 선언문 사용
            console.log(that.name, friend);         
        });
    },
};
console.log('relationship1');
relationship1.logFriends();

console.log();

// 2) 화살표 함수
const relationship2 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFriends() {
        this.friends.forEach(friend => {    // me, 화살표 함수 사용
            console.log(this.name, friend); 
        });
    },
};
console.log('relationship2');
relationship2.logFriends();

/* 
    - 1) 처럼 logFriends의 forEach문에서 function 선언문을 사용할 경우,
        각자 다른 함수 스코프의 this를 가지므로 that(this대입)이라는 변수를 
        미리 만들어 relationship1에 간접적으로 접근하고 있음.

    - 2) 처럼 logFriends의 forEach문에서 화살표함수를 사용할 경우,
        바깥 스코프인 logFriends()의 this를 그대로 사용할 수 있음!

    * me, 이해..? 추측성?
        - 잘 생각해보면, 1) function 선언문의 경우 스코프 {}를 가지므로
        큰 틀의 this을 function의 스코프 {}안에서 하려면, 미리 다른 변수에 대입해서
        해당 function 스코프에 그 this를 대입한 변수를 쓰는게 맞는거같음.

        - 2) 화살표 함수의 경우 큰 틀의 this를 그대로 가져와서 쓰는거 같음. 
        화살표 함수의 스코프{}의 경우 this를 미리 다른 변수에 대입할 필요가 없는 듯
*/