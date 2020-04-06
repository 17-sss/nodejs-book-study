// [12.3 : 03-1.]
// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자는 없는 경매를 찾아서 낙찰자를 지정하는 코드

const { Good, Auction, User, sequelize, Sequelize: {Op} } = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();

        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) START ===
        const allGoods = await Good.findAll();
        
        for (const key in allGoods) {
            let timeHour = parseInt(allGoods[key].timeHour);
            let timeMin = parseInt(allGoods[key].timeMin);
            let createdAt = allGoods[key].createdAt;
            console.log(timeHour, timeMin);

            yesterday.setHours(yesterday.getHours() + timeHour);
            yesterday.setMinutes(yesterday.getMinutes() + timeMin);

            console.log(createdAt, yesterday)

            if (createdAt <= yesterday) {   // 조건문 잘못됨. (나중에 수정바람)
                const ex = async () => {
                    try {
                        const success = await Auction.find({
                            where: {goodId: allGoods[key].id},
                            order: [['bid', 'DESC']],
                        });
                        
                        await Good.update({soldId: success.userId}, {where: {id:target.id}});
                        await User.update({
                            money: sequelize.literal(`money - ${success.bid}`),
                        }, {
                            where: {id: success.userId},
                        });    
                    } catch (error) {
                        console.error(error);
                    }                    
                }
                ex();
            } else {
                continue;
            }
            
        }
        // [12.4.1 : 02.]   (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===
    } catch (error) {
        console.error(error);
    }
};