// [12.3 : 03-1.]
// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자는 없는 경매를 찾아서 낙찰자를 지정하는 코드

const { Good, Auction, User, sequelize, Sequelize: {Op} } = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // 현재 시간에서 하루 전으로 세팅
        const targets = await Good.findAll({
            where: {
                soldId: null,
                createdAt: { [Op.lte] : yesterday },    
                /* 
                    ** [12.4.1(txt) : 메모 - 1.]     (200405)
                        | 교재($lte 사용시) 에서 나온대로 실습결과 <= 연산자가 되어야하는데 계속 = 연산자만 됨..

                        1) 200214_시퀄라이즈_(7.6.4).txt 메모를 읽어본 결과,
                            Sequelize 에서 Op 객체를 가져와서 연산자를 만들어야 함.
                        2) [Op.lte]에서
                            lte는 크거나 같다(createAt <= yesterday(지금시간에서 하루 전) )
                */
            },
        });

        targets.forEach(async (target) => {
            const success = await Auction.find({
                where: {goodId: target.id},
                order: [['bid', 'DESC']],
            });

            await Good.update({soldId: success.userId}, {where: {id:target.id}});
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: {id: success.userId},
            });
        });
    } catch (error) {
        console.error(error);
    }
};