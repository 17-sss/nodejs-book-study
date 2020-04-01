const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Good = require('./good')(sequelize, Sequelize);
db.Auction = require('./auction')(sequelize, Sequelize);


/*
  * 사용자 모델, 상품 모델 간에는 일대다 관계가 두번 적용.
  - 사용자가 여러 상품을 낙찰받을수도, 여러 상품을 등록할 수도 있기에
*/
db.Good.belongsTo(db.User, { as:'owner' });
db.Good.belongsTo(db.User, { as:'sold' });

// 사용자가 입찰을 여러 번 할 수 있으므로 사용자 모델과 경매 모델은 일대다 관계
db.User.hasMany(db.Auction);
db.Auction.belongsTo(db.User);

// 한 상품에 여러 명이 입찰하므로 상품 모델과 경매모델도 일대다 관계
db.Good.hasMany(db.Auction);
db.Auction.belongsTo(db.Good);



module.exports = db;