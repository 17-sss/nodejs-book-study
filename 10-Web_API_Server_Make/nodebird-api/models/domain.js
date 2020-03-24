// [10.2]
module.exports = (sequelize, DataTypes) => (
    sequelize.define('domain', {
        host: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        // [10.8.1] START
        //  3. 클라이언트용과 서버용 비밀키를 구분해서 발급하기
        serverSecret: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        clientSecret: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },   
        // [10.8.1] END
    }, {
        validate: {
            unknownType() {
                console.log(this.type, this.type !== 'free', this.type !== 'premium');

                if (this.type !== 'free' && this.type !== 'premium') {
                    throw new Error('type 컬럼은 free나 premium이어야 합니다.');
                }
            },
        },
        timestamps: true,
        paranoid: true,
    })
);