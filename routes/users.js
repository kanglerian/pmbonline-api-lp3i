const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifytoken = require('../middlewares/verifytoken');

/* GET users listing. */
router.get('/', verifytoken, async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

module.exports = router;
