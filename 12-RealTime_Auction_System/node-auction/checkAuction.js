// [12.3 : 03-1.]
// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자는 없는 경매를 찾아서 낙찰자를 지정하는 코드

const { Good, Auction, User, sequelize, Sequelize: {Op} } = require('./models');
const schedule = require('node-schedule');  // [12.4.1 : 03.]  (노드 서버 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성)

const checkEx = async (Agood) => {
    const success = await Auction.find({
        where: {goodId: Agood.id},
        order: [['bid', 'DESC']],
    });
    
    if (success !== null) {                                
        await Good.update({soldId: success.userId}, {where: {id:Agood.id}});
        await User.update({
            money: sequelize.literal(`money - ${success.bid}`),
        }, {
            where: {id: success.userId},
        });                                 
    } else {
        // [12.4.1 : 04.] (아무도 입찰을 하지 않아 낙찰자가 없을 때 처리 로직 구현하기)
        await Good.destroy({
            where: {id: Agood.id}                        
        });
    }      
};

module.exports = {
    checkTime: async () => {
        try {        
            // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) START ===            
            const allGoods = await Good.findAll({
                where: {
                    soldId: null,
                    deletedAt: null,
                },
            });

            console.log('[checkTime] allGoods.length:',allGoods.length);
            allGoods.forEach(async (e, index) => {
                let timeHour = parseInt(e.timeHour);
                let timeMin = parseInt(e.timeMin);
                let yesterday = new Date();
                let createdAt = new Date(e.createdAt);    
                
                yesterday.setHours(yesterday.getHours() - timeHour);
                yesterday.setMinutes(yesterday.getMinutes() - timeMin);
                
                //console.log(`yesterday: ${yesterday}\ncreatedAt: ${createdAt}\n\n`)
                // 현재 시간을 각 데이터의 설정된 시간 (시, 분) 전으로 설정하고 데이터 생성 시간보다 클 경우 해당 로직 수행
                if (createdAt <= yesterday) {                                   
                    checkEx(e);                    
                }                
            });
            // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===
        } catch (error) {
            console.error(error);
        }
    },    

    // [12.4.1 : 03.]  (노드 서버 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성) START ==
    createSchedule: async () => {
        try {            
            const allGoods = await Good.findAll({
                where: {
                    soldId: null,
                    deletedAt: null,
                },
            });
            
            console.log('[createSchedule] allGoods.length:',allGoods.length);

            allGoods.forEach(async (e, index) => {  // e는 element                
                let timeHour = parseInt(e.timeHour);
                let timeMin = parseInt(e.timeMin);        

                const end = new Date(e.createdAt);            
                end.setHours(end.getHours() + timeHour);            
                end.setMinutes(end.getMinutes() + timeMin);
                
                // schedule.scheduleJob(end, checkEx(e));   // 이렇게하면 안됨. 의도한대로 동작하지 않음
                schedule.scheduleJob(end, async () => {
                    checkEx(e);                                                         
                });  
                
            });
        } catch (error) {
            console.error(error);
        }
    },
    // [12.4.1 : 03.]  (노드 서버 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성) END ==
};