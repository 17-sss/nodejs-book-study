const A = require('./globalA');

global.message = '안녕하세요';
console.log(A());

/* 
    ** REPL에서 이 파일 실행.
        결과를 보면, globalB에서 넣은 global.message 값을
        globalA에서도 접근할 수 있음.
*/