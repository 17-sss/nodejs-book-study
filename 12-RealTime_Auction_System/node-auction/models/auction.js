// [12.1]
module.exports = (sequelize, DataTypes) => (
    sequelize.define('auction', {
        bid: {  // 입찰가
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        msg: {  // 메세지
            type: DataTypes.STRING(100),
            allowNull: true,    // 입찰 시 메세지는 null이어도 됨
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);

