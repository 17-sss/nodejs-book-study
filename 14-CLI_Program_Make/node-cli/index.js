#!/usr/bin/env node

/*
console.log('Hello CLI');   // [14.1 [1]: 02]
console.log(process.argv);  // [14.1 [1]: 05]
*/

// [14.1 [1]: 06] (사용자로부터 입력을 받는 기능, 종료) START
/*
const readline = require('readline');
const rl = readline.createInterface({
    // process.stdin, stdout: 콘솔 입출력을 담당하는 스트림
    input: process.stdin,   
    output: process.stdout,
});

rl.question('예제가 재미있습니까? (y/n)  ', (answer) => {
    if (answer === 'y') {
        console.log('감사합니다');
    } else if (answer === 'n') {
        console.log('죄송합니다!');
    } else {
        console.log('y 또는 n만 입력하세요');
    }
    rl.close();
});
*/
// [14.1 [1]: 06] (사용자로부터 입력을 받는 기능, 종료) END





// [14.1 [1]: 07] (사용자로부터 입력을 받는 기능, 다시 입력) START
const readline = require('readline');
const rl = readline.createInterface({    
    input: process.stdin,   
    output: process.stdout,
});

console.clear();

const answerCallback = (answer) => {
    if (answer === 'y') {
        console.log('감사합니다');
        rl.close();
    } else if (answer === 'n') {
        console.log('죄송합니다!');
        rl.close();
    } else {
        console.clear();
        console.log('y 또는 n만 입력하세요');
        rl.question('예제가 재미있습니까? (y/n)  ', answerCallback);        
    }
};

rl.question('예제가 재미있습니까? (y/n)  ', answerCallback);   
 
// [14.1 [1]: 07] (사용자로부터 입력을 받는 기능, 다시 입력) END
