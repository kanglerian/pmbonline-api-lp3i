const express = require('express');
const router = express.Router();
const { User } = require('../models');

/* GET presenters listing. */
router.get('/', async (req, res) => {
  try {
    const response = await User.findAll({
      where: {
        role: 'P',
        status: true,
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