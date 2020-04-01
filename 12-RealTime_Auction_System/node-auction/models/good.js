// [12.1]
module.exports = (sequelize, DataTypes) => (
    sequelize.define('good', {
        name: {  // 상품명
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        img: {   // 상품 사진
            type: DataTypes.STRING(200),
            allowNull: true,
        },  
        price: { // 시작 가격
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);