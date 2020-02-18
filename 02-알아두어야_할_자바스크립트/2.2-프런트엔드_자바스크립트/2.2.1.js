// [2.2] 프런트엔드 자바스크립트
// [2.2.1] AJAX
/* 
    - AJAX(Asynchronous Javascript And XML)는 비동기적 웹 서비스를 개발하기 위한 기법
    - 페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술  
*/

// 1. xhr.onreadystatechange 사용
/* <script> */  // HTML의 script태그 안에서 쓰임.
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () { // 요청에 대한 콜백
    if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) { // 응답 코드가 200이나 201이면
            // 성공
            console.log(xhr.responseText); // 서버에서 보내주는 값
        } else {
            // 실패
            console.error(xhr.responseText);
        }
    }
};
xhr.open('GET', 'https://www.zerocho.com/api/get'); // GET / 메서드와 주소 설정
xhr.send(); // 요청 전송
/* </script> */


// 2. xhr.onload & onerror 사용
/* <script> */ 
var xhr = new XMLHttpRequest();
xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 201) {
        console.log(xhr.responseText);
    }
};
xhr.onerror = function() {
    console.error(xhr.responseText);
};
xhr.open('GET', 'https://www.zerocho.com/api/get'); // GET / 메서드와 주소 설정
xhr.send(); // 요청 전송
/* </script> */ 


// 3. 서버로 데이터를 같이 보내는 POST 요청의 경우
/* <script> */ 
var xhr = new XMLHttpRequest();
var data = {
    name: 'zerocho',
    birth: 1994,
};
xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
            console.log(xhr.responseText);
        } else {
            console.error(xhr.responseText);
        }
    }
}
xhr.open('POST', 'https://www.zerocho.com/api/post/json'); // POST
xhr.setRequestHeader('Content-Type', 'application/json'); // 콘텐츠 타입을 json으로
xhr.send(JSON.stringify(data)); // 요청 전송 (POST / 데이터를 동봉해 전송)
/* </script> */