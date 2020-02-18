// [2.2.3] encodeURLComponent, decodeURIComponent
// 

/* <script>*/
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() { // 요청에 대한 콜백
    if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
        if (xhr.status === 200 || xhr.status === 201) { // 응답 코드가 200이나 201이면
            console.log(xhr.responseText); // 서버에서 보내주는 값
        } else {
            console.error(xhr.responseText);
        }
    }
};
// 한글 주소 인코딩 후 전송
xhr.open('GET', 'https://www.zerocho.com/api/search/' 
                + encodeURIComponent('노드'));
xhr.send(); // 요청 전송

/*
** 보내는 부분일 경우
    ▶ encodeURIComponent('노드') 
        '노드' > '%EB%85%B8%EB%93%9C' 로 변환됨 
        
** 받는 부분일 경우
    ▶ decodeURIComponent('%EB%85%B8%EB%93%9C'); 
        '%EB%85%B8%EB%93%9C' > '노드' 로 변환됨
*/
/* </script>*/