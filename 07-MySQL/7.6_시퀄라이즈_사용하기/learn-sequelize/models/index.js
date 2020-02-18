// [7.6] 시퀼라이즈 사용하기
// sequelize-cli가 자동으로 생성해주는 코드. 그대로 사용시 에러 발생. 그러므로 수정.
  // + 수정된 파일의 원본 파일은 _bak 폴더안에 있음
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname,'..','config','config.json'))[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// [7.6.2] 모델 정의하기 
// 객체 db에 user, comment 모델 추가. 
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
// ---

// [7.6.3] 관계 정의하기
// [7.6.3.1] 1:N
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
// ---

module.exports = db;