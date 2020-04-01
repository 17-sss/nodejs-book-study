// [12.1]
module.exports =  (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {    // 이메일
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },

        nick: {     // 닉네임
            type: DataTypes.STRING(15),
            allowNull: false,
        },

        password: { // 비밀번호
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        money: {    // 보유자금
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);