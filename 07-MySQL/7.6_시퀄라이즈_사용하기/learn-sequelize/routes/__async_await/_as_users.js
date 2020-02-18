// router : user (async / await)
var express = require('express');
var User = require('../models').User; // [7.6.5]

var router = express.Router();

// [7.6.5] START =======
/* GET users listing. */
// GET : '/'
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST : '/'
router.post('/', async (req, res, next) => {
  try {
    const result = await User.create({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    });
    
    console.log(result);
    res.status(201).json(result);

  } catch (error) {
    console.error(error);
    next(error);
  }
});
// [7.6.5] END =======

module.exports = router;
