const express = require('express');
const router = express.Router();
const verifyapikey = require('../middlewares/verifyapikey');
const { User } = require('../models');

/* GET presenters listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    const data = await User.findAll({
      where: {
        role: 'P',
        status: true,
      },
      attributes: ['identity', 'name', 'email', 'phone']
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;