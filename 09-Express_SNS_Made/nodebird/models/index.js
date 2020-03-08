// [9.2]
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

// [1] User와 Post는 1 대 1 관계이므로 서로 연결되어 있음.
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User); // 시퀄라이즈에서 Post모델에 userId 컬럼을 추가함
// ======

// [2] Post와 Hashtag 모델은 다대다 관계 
// 시퀄라이즈가 관계를 분석하여 postHashtag라는 이름의 테이블을 자동생성.
// 컬럼의 이름은 PostId 그리고 hashtagId 임.
db.Post.belongsToMany(db.Hashtag, {
  through: 'PostHashtag'
});
db.Hashtag.belongsToMany(db.Post, {
  through: 'PostHashtag'
});
/* 
  post 데이터에는 getHashtags, addHashTags 등의 메서드를 추가
  hashtag 데이터에는 getPosts, addPosts 등의 메서드를 추가
*/
// ======

// [3] 같은 테이블끼리도 다대다 관계가 가능 (팔로잉 기능도 다대다 관계)
// 시퀄라이즈가 Follow라는 테이블을 생성
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',  // 시퀄라이즈에서 addFollower, getFollowers 메서드 추가
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings', // 시퀄라이즈에서 addFollowing, getFollowings 메서드 추가
  through: 'Follow',
});
/* 
  1) through 옵션: 생성할 모델이름을 지정
    같은 테이블간의 다대다 관계에서도 모델이름 컬럼이름을 따로 정해주어야함.
    모델이름이 UserUser일 수 없으니 through 옵션을 사용하여 생성 될 모델이름 Follow로 지정
  
  2) foreignKey 옵션
    Follow모델에서 사용자 아이디를 저장하는 컬럼이 둘 다 userId이면 
    누가 팔로워고 누가 팔로잉 중인지 구분이 불가하기에, 따로 설정해주어야함.
    foreignKey 옵션을 사용해 구분해 Follow 테이블내에서 사용자 아이디를 구별.
  
  3) as 옵션: 시퀄라이즈가 JOIN 작업 시 사용하는 이름.
    as에 등록한 이름을 바탕으로 시퀄라이즈는 
    getFollowings, getFollowers, addFollowing, addFollower 등 메서드를 자동으로 추가함
*/
// ======

module.exports = db;