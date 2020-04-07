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
        // [12.4.1 : 02.] (경매 시간을 자유롭게 조정할 수 있게 만들기) START ===
        timeHour: { // 제한 시간 (시)
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        timeMin: {  // 제한 시간 (분)
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }
        // [12.4.1 : 02.] (경매 시간을 자유롭게 조정할 수 있게 만들기) END ===
    }, {
        timestamps: true,
        paranoid: true,
    })
);