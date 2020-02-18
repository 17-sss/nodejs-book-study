// [3.2] JS 파일 실행하기
/* 
    - cmd에서 node 입력 후 실행해보기. 
        (REPL에서 실행해보기와 같은 말)
*/
function helloWorld() {
    console.log('Hello World');
    helloNode();
};

function helloNode() {
    console.log('Hello Node');
}
helloWorld();