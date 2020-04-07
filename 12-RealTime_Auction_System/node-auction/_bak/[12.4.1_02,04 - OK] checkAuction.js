// [12.3 : 03-1.]
// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자는 없는 경매를 찾아서 낙찰자를 지정하는 코드

const { Good, Auction, User, sequelize, Sequelize: {Op} } = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();
    
        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) START ===
        const allGoods = await Good.findAll();

        allGoods.forEach(async (e, index) => {
            let timeHour = parseInt(e.timeHour);
            let timeMin = parseInt(e.timeMin);
            let createdAt = e.createdAt;    
            yesterday.setHours(yesterday.getHours() - timeHour);
            yesterday.setMinutes(yesterday.getMinutes() - timeMin);

            if (createdAt <= yesterday) {  
                const success = await Auction.find({
                    where: {goodId: e.id},
                    order: [['bid', 'DESC']],
                });

                if (success !== null) {
                    await Good.update({soldId: success.userId}, {where: {id:e.id}});
                    await User.update({
                        money: sequelize.literal(`money - ${success.bid}`),
                    }, {
                        where: {id: success.userId},
                    });    
                } else {
                    // [12.4.1 : 04.]   (아무도 입찰을 하지 않아 낙찰자가 없을 때 처리 로직 구현하기) START ===                    
                    await Good.destroy({
                        where: {id: e.id}                        
                    }); 
                    // [12.4.1 : 04.]   (아무도 입찰을 하지 않아 낙찰자가 없을 때 처리 로직 구현하기) END ===
                }                
            }
        });
        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===
    } catch (error) {
        console.error(error);
    }
};