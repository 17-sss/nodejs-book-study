// [8.6.1] 몽고디비 연결하기

const mongoose = require('mongoose');

module.exports = () => {

    const connect = () => {
        // 1 START) 개발환경이 아닐 때, 몽구스가 생성하는 쿼리 내용을 콘솔을 통해 확인할 수 있는 부분
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        // 1 END)

        // 2 START) 몽구스와 몽고디비를 연결
        mongoose.connect('mongodb://test:1234@localhost:27017/admin', {
            dbName: 'nodejs',
        }, (error) => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        });
        // 2 END)
    };
    

    connect();

    // 3 START) 커넥션에 이벤트 리스너를 달아둠.
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        connect();
    });
    // 3 END)

    // 4 START) 다른 스키마들 연결 (user, comment)
    require('./user');  
    require('./comment');
    // 4 END) 
};