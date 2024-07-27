const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifytoken = require('../middlewares/verifytoken');

/* GET users listing. */
router.get('/', verifytoken, async (req, res) => {
  console.log(req.headers.authorization);
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;
