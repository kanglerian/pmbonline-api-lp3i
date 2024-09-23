const express = require('express');
const router = express.Router();
const verifyapikey = require('../middlewares/verifyapikey');
const { User } = require('../models');

/* GET presenters listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await User.findAll({
      where: {
        role: 'P',
        status: true,
      },
      attributes: ['identity', 'name', 'email', 'phone'],
      limit: limit,
      offset: offset,
    });

    const totalItems = await User.count({
      where: {
        role: 'P',
        status: true,
      },
    });
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      totalPages: totalPages,
      totalItems: totalItems,
      currentPage: page,
      data: response.length > 0 ? response : [],
      limit,
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;