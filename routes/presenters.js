const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifytoken = require('../middlewares/verifytoken');

/* GET presenters listing. */
router.get('/', verifytoken, async (req, res) => {
  try {
    const response = await User.findAll({
      where: {
        role: 'P',
      },
      attributes: ['identity','name','email','phone']
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;