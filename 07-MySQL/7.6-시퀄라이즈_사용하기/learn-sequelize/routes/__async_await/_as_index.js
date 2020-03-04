// router : index (async / await)
var express = require('express');
var User = require('../models').User; // [7.6.5]

var router = express.Router();

// [7.6.5] START =======
/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('sequelize', { users });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// [7.6.5] END =======

module.exports = router;
