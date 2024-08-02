const express = require('express');
const router = express.Router();
const { School } = require('../models');

/* GET schools listing. */
router.get('/', async (req, res) => {
  try {
    const response = await School.findAll({
      attributes: ['id','name']
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;