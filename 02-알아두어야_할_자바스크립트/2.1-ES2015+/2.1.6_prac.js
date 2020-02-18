// [2.1.6] 프로미스 - 연습

const condition = false;
const promise = new Promise( (resolve, reject)=> {
    if (condition) {
        resolve('성공 / then');
    } else {
        reject('실패 / catch');
    }
});

promise
    .catch( (err1) => {
        console.error(err1);
        const condi = true;

        return new Promise ( (resolve, reject) => {
            if (condi) {
                resolve(err1 + ' 나에러아니다');
            } else {
                reject(err1 + ' 나에러다');
            }
            
        });
    })
    .then( (message2) => {
        console.log(message2);
    })
    .catch( (err2) => {
        console.error(err2);
    })

