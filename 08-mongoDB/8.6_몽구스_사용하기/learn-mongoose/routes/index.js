var express = require('express');
var User = require('../schemas/user'); // [8.6.3]

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // [8.6.3] START
  User.find({})
    .then((users) => {
      res.render('mongoose', { users });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
  // [8.6.3] END
});

module.exports = router;