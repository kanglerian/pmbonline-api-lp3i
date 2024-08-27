const express = require('express');
const router = express.Router();
const { Organization } = require('../models');

/* GET presenters listing. */
router.get('/', async (req, res) => {
  try {
    const response = await Organization.findAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
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
    return res.status(200).json(organization);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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