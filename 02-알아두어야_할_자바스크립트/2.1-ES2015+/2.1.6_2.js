// [2.1.6] 프로미스 - 2

// 1-1) 콜백을 프로미스로 전환 - 기존 콜백
function findAndSaveUser(Users) {
    Users.findOne( {}, (err, user) => { // 첫번째 콜백
        if (err){
            return console.error(err);
        }
        user.name = 'zero';
        user.save((err) => { // 두번째 콜백
            if (err) {
                return console.error(err);
            }

            Users.findOne({gender: 'm'}, (err, user) => { // 세번째 콜백
                // 생략
            });
        });
    });    
}

// 1-2) 콜백을 프로미스로 전환 - 프로미스로 전환
function findAndSaveUser(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then( (user) => {
            return Users.findOne({gender: 'm'});
        })
        .then((user)=> {
            // 생략
        })
        .catch(err => {
            console.error(err);
        });
}

// 2) 프로미스 여러 개를 한번에 실행 (Promise.all)

// Promise.resolve : 즉시 resolve하는 Promise생성 (Promise.reject도 있음)
const promise1 = Promise.resolve('성공1'); 
const promise2 = Promise.resolve('성공2');  
Promise.all([promise1, promise2])
    .then((result)=> {
        console.log(result); // [성공1, 성공2]
    })
    .catch((error)=> {
        console.error(error);
    })
/* 
    - 프로미스가 여러개 있을 때 Promise.all에 넣으면 모두 resolve될 때까지
        기다렸다가 then으로 넘어감.
      ==> Promise 중 하나라도 reject가 되면 catch로 넘어감
*/