// [12.3 : 03-1.]
// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자는 없는 경매를 찾아서 낙찰자를 지정하는 코드

const { Good, Auction, User, sequelize} = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const targets = await Good.findAll({
            where: {
                soldId: null,
                createdAt: { $lte: yesterday },
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