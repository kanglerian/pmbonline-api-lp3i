const express = require('express');
const router = express.Router();
const { School } = require('../models');
const verifyapikey = require('../middlewares/verifyapikey');

/* GET schools listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    const response = await School.findAll({
      attributes: ['name','region','lat','lng','status'],
    });
    return res.status(200).json({
      data: response
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;