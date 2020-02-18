// [2.2.4] data attrubute와 dataset
/* 
    - 프런트엔드에 데이터를 내려보낼 때 첫 번째 고려해야할 점은 보안.
    민감한 데이터를 내려보내는 것은 실수임. (비밀번호 등..)
    - 보안과 관련없는 데이터는 자유롭게 보내도..
*/
// data attrubute: HTML5의 HTML과 관련된 데이터를 저장하는 방법 


<ul>
    <li data-id='1' data-user-job='programmer'>Zero</li>
    <li data-id='2' data-user-job='designer'>Nero</li>
    <li data-id='3' data-user-job='programmer'>Hero</li>
    <li data-id='4' data-user-job='ceo'>Kero</li>
</ul>

/*<script>*/
    console.log(document.querySelector('li').dataset);
    // { id:'1', userJob:'programmer' }
/*</script>*/

  

