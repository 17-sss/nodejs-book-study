// [2.1.7] async/await

/*
    async/await는 노드 7.6부터 지원, 자바스크립트 스팩은 ES2017 (ES8)
    프로미스가 콜백 지옥을 해결했다지만, 여전히 코드가 장황함.
    async/await 문법은 프로미스를 사용한 코드를 더 말끔하게 줄여줌
*/

// 1-1) 프로미스 사용
function findAndSaveUser(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then((user) => {
            return Users.findOne({gender: 'm'});
        })
        .then((user)=> {
            // 생략
        })
        .catch( (err) => {
            console.error(err);                
        });    
}

// 1-2) async/await 사용
/* 
    me, 자체적으로 user.save() 나 Users.findOne은 프로미스가 포함되어있는듯
        아래 코드보면 해당 코드들 await붙음
*/
async function findAndSaveUser(Users) {
    try {
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({gender:'m'});
        // 생략    
    } catch (error) {
        console.error(error);
    }    
}

// 1-3) async/await 사용 - 화살표함수
const findAndSaveUser = async(Users) => {
    try {
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({gender:'m'});
        // 생략    
    } catch {
        console.error(error);
    }
}

// 1-4) async/await 사용 - Promise.all 대체
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async ()=> {
    for await (promise of [promise1, promise2]) {
        console.log(promise);
    }
})();