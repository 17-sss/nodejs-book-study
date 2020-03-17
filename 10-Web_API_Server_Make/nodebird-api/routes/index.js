// [10.2]
const express = require('express');

// uuid는 범용 고유 식별자로 고유한 문자열을 만들고 싶을 때 사용
const uuidv4 = require('uuid/v4');
const { User, Domain } = require('../models');

const router = express.Router();

router.get('/', (req, res, next) => {
    User.find({
        where: { id: req.user && req.user.id },
        include: { model: Domain },
    })
        .then((user) => {
            res.render('login', {
                user,
                loginError: req.flash('loginError'),
                domains: user && user.domains,
            });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/domain', (req, res, next) => {
    Domain.create({
        userId: req.user.id,
        host: req.body.host,
        type: req.body.type,
        clientSecret: uuidv4(),
    })
        .then(()=> {
            res.redirect('/');
        })
        .catch((error) => {
            next(error);
        }); 
});



/*  // async / await 형식 (연습)
router.get('/', async (req, res, next) => {
    try {
        const user = await User.find({
            where: { id: req.user && req.user.id },
            include: { model: Domain },
        });
        
        res.render('login', {
            user,
            loginError: req.flash('loginError'),
            domains: user && user.domains,
        })
    } catch (error) {
        next(error);
    }
});

router.post('/domain', async (req, res, next) => {
    try {
        await Domain.create({
            userId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
        });
        
        res.redirect('/');
    } catch (error) {
        next(error);   
    }
});
*/

module.exports = router;