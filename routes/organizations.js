const express = require('express');
const router = express.Router();
const verifytoken = require('../middlewares/verifytoken');
const { Organization } = require('../models');

/* GET organizations listing by identityUser . */
router.get('/:identityUser', verifytoken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await Organization.findOne({
      where: {
        identityUser: req.params.identityUser
      },
      limit: limit,
      offset: offset,
    });

    const totalItems = await Organization.count({
      where: {
        identityUser: req.params.identityUser
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

router.post('/', verifytoken, async (req, res) => {
  try {
    const data = {
      identityUser: req.body.identity_user,
      name: req.body.name,
      position: req.body.position,
      year: req.body.year,
    }
    await Organization.create(data);
    return res.status(200).json({
      message: 'Organization has been success!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.patch('/:id', verifytoken, async (req, res) => {
  try {
    const organization = await Organization.findOne({
      where: {
        id: req.params.id
      }
    });
    if(!organization){
      return res.status(404).json({
        message: 'Organization not found!',
      });
    }
    const data = {
      name: req.body.name,
      position: req.body.position,
      year: req.body.year,
    }
    await Organization.update(data, {
      where: {
        id: req.params.id,
      }
    });
    return res.status(200).json({
      message: 'Organization has been updated!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.delete('/:id', verifytoken, async (req, res) => {
  try {
    await Organization.destroy({
      where: {
        id: req.params.id
      }
    });
    return res.status(200).json({
      message: 'Organization has been deleted!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;