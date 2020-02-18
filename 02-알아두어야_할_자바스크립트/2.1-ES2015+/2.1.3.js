// [2.1] ES2015+
// [2.1.3] 객체 리터럴
var sayNode = function () {
    console.log('Node');    
};
var es = 'ES';

// [1] oldObject
var oldObject = {
    sayJS : function () {   // 함수
        console.log('JS');        
    },
    // oldObject.sayNode()에 위에 선언된 sayNode 함수를 대입함. 
    sayNode: sayNode        // 함수
};

oldObject[es+'6'] = 'Fantastic'; // oldObject 안에 ES6라는 속성(문자열)을 추가

oldObject.sayNode();        // Node
oldObject.sayJS();          // JS
console.log(oldObject.ES6); // Fantastic

// -----------------

// [2] newObject
const newObject = {
    sayJS() {
        console.log('JS');
    },
    //위에 선언된 sayNode 함수를 newObject의 속성에 자동 추가
    sayNode,    
    // es변수 값 -> ES, ES6라는 속성(문자열)을 추가
    [es + 6]: 'Fantastic'   
}
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic

/* 
    [1] oldObject와 [2] newObject 비교

    - oldObject와 newObject를 비교해서 보면 됩니다. sayJS 같은 객체의
      메서드에 함수를 연결할 때 더는 콜론(:)과 function을 붙이지 않아도 됩니다.
    - sayNode: sayNode처럼 속성명과 변수명이 겹치는 경우에는 한 번만 쓸 수 있게 됨.
*/