// [2.1.6] 프로미스 - 1

// 1. 프로미스 객체 생성
const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
    if (condition) {
        resolve('성공');
    } else {
        reject('실패');
    }
});


promise
    .then((message) => {
        console.log(message);   // 성공(resolve)한 경우 실행
    })
    .catch((error) => {
        console.error(error);   // 실패(reject)한 경우 실행
    });

// 2. then이나 catch에서 다시 다른 then이나 catch를 붙일 수 있음.
/* 이전 then의 return 값을 다음 then의 매개변수를 넘김 
    프로미스를 return한 경우 프로미스가 수행된 후 다음 then이나 catch 호출*/
promise
    .then((message1) => {
        console.log('message1', message1);
        return new Promise((resolve, reject) => {
            // 1) 여기서 message1를 resolve하면 다음 then인
            resolve(message1);
        });
    })
    .then((message2) => {
        console.log('message2', message2);
        return new Promise((resolve, reject) => {
            // 2) 여기서 1)에서 resolve한 message를 받을 수 있음.
            resolve(message2);
            // 3) 다시 message2를 resolve하면 다음 then인
        });
    })
    .then((message3) => {
        // 4) 여기서 message2를 받음
        console.log('message3', message3);

        /* 
            * me 
            - 직전의 then에서 return값으로 새로운 Promise를 만들지 않고
                이 then으로 넘어오면 message3는 undefined
            - 직전의 then에서 return값으로 새로운 Promise를 만들고
                resolve를 해주지 않는다면, console.log(message3)는 출력도 안됨.
        */ 
    })
    .catch((error)=>{
        console.error(error);
    })
    

