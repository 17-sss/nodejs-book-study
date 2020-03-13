// [9.2]
module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
            /* 
                + sns로그인을 하였을 경우, provider와 snsId를 저장.
                    - provider가 
                        'local'이면 로컬로그인을 한 것.
                        'kakao'면 카카오 로그인을 한 것.
            */
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,         
        // 두 옵션이 true이므로 createdAt, updatedAt, deletedAt 컬럼도 생성됨.        
    })
);