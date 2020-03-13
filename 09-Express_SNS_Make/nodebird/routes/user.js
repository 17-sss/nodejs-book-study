// [9.5]
const express = require('express');

const {isLoggedIn} = require('./middlewares');
const {User} = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.find({where: { id: req.user.id}});
        await user.addFollowing(parseInt(req.params.id, 10));
        // [??] addFollowing: /nodebird/models/index.js  주석 참고
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// [9.5.1 : ???] 스스로해보기 - 팔로잉 끊기 START ===
// 다대다 관계의 가운데 테이블은 직접 접근할 수가 없다함.
router.delete('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        // 참고 링크: https://www.zerocho.com/category/etc/post/5b4c1d526a3abe001b94de0b  
        const user = await User.find( {where: {id: req.user.id} }); // 현재 로그인한 유저의 값(고유번호)를 가져온 뒤..
        await user.removeFollowing(req.params.id);  // 프론트단에서 보내준 param.id(userId)의 값 기준으로 언팔.
        
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// [9.5.1 : ???] 스스로해보기 - 팔로잉 끊기 END ===

module.exports = router;