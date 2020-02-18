// router : index (promise) (book)
var express = require('express');
var User = require('../models').User; // [7.6.5]

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // [7.6.5] START ======= 
  User.findAll()
    .then((users) => {
      res.render('sequelize', { users });
    })
    .catch((err)=> {
      console.error(err);
      next(err);
    });
  // [7.6.5] END ======= 

  // [7.6.5] DELETE
  // res.render('index', { title: 'Express' }); 
});

module.exports = router;
