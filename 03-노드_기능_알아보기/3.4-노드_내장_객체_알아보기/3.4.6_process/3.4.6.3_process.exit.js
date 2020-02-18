// [3.4.6.3] process.exit(코드)
/* 
    ** 실행 중인 노드 프로세스를 종료함.
    - 서버에 사용하면 서버가 멈추므로 서버에서는 
        거의 사용하지 않음
    - 서버 외의 독립적인 프로그램에서는 수동으로 노드를 
        멈추게 하기 위해 사용
*/

let i = 1;
setInterval(() => {
   if (i === 5)  {
       console.log('종료');
       process.exit();  
   }
   console.log(i);
   i += 1; 
}, 1000);