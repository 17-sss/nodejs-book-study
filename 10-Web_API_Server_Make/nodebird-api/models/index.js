// [10.2] [9.2]의 코드 가져와서 수정함.
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Domain = require('./domain')(sequelize, Sequelize); // [10.2]

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

db.Post.belongsToMany(db.Hashtag, {
  through: 'PostHashtag'
});
db.Hashtag.belongsToMany(db.Post, {
  through: 'PostHashtag'
});

db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});

db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings', 
  through: 'Follow',
});

/*
db.User.belongsToMany(db.Post, {through: 'postLike'});
db.Post.belongsToMany(db.User, {through: 'postLike', as: 'Liker'});  
*/

// 도메인 모델은 사용자 모델과 일대다 관계
  // 사용자 한 명이 여러 도메인을 소유할 수 있기 때문.
db.User.hasMany(db.Domain);   // [10.2]
db.Domain.belongsTo(db.User); // [10.2]


module.exports = db;