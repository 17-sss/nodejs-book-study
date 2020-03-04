// router : user (promise) (book)
var express = require('express');
var User = require('../models').User; // [7.6.5]

var router = express.Router();

/* GET users listing. */
// GET : '/'
router.get('/', function(req, res, next) {
  // [7.6.5] START ======= 
  User.findAll()
    .then((users) => {
      res.json(users);   
    })
    .catch((err)=> {
      console.error(err);
      next(err);
    });
  // [7.6.5] END ======= 

  // [7.6.5] DELETE
  // res.send('respond with a resource');
});

 
// [7.6.5] START ======= 
// POST : '/'
router.post('/', (req, res, next) => {
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});
// [7.6.5] END =======

module.exports = router;
