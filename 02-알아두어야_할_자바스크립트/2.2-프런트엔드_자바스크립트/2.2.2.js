// [2.2.2] FormData
/*
    * FormData
    HTML form 태그의 데이터를 동적으로 제어할 수 있는 기능.
    주로 AJAX와 함께 사용됩니다.
    - append('키', '값(배열도 가능)'): key(data명) 추가
    - has('키'): 해당 key 존재여부 체크
    - get('키'): 해당 key의 value를 가져옴. 첫번째만 가져오는 듯.
    - getAll('키'): 해당 key의 value를 전부 가져옴
    - delete('키'): 해당 key를 제거
    - set('키', '값(배열도 가능)'): 해당 key를 수정
*/

// 1. formData 생성 예시
/* <script> */
var formData = new FormData();
formData.append('name', 'zerocho');
formData.append('item', 'orange');
formData.append('item', 'melon');
formData.has('item');       // true
formData.has('money');      // false
formData.get('item');       // orange
// formData.get('item')[1]; // me, orange의 r이 나옴
formData.getAll('item');    // [orange, melon];
formData.append('test', ['hi','zero']);  
formData.get('test');       // hi, zero
formData.delete('test');   
formData.get('test')        // null
formData.set('item', 'apple');
formData.getAll('item');    // ['apple']
/* </script> */


// 2. AJAX로 formData를 서버에 보내기.
/* <script> */
var xhr = new XMLHttpRequest();
var formData = new FormData();
formData.append('name', 'zerocho');
formData.append('birth', 1994); // me, 대단한 사람.. 나보다 어려 ㅠ
xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
            console.log(xhr.responseText);
        } else {
            console.error(xhr.responseText);
        }
    }
};
xhr.open('POST', 'https://www.zerocho.com/api/post/formdata'); // POST
xhr.send(formData); // 폼 데이터 객체 전송

/* </script> */