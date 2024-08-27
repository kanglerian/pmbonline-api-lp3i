const express = require('express');
const router = express.Router();
const { Achievement } = require('../models');

/* GET presenters listing. */
router.get('/', async (req, res) => {
  try {
    const response = await Achievement.findAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      where: {
        id: req.params.id
      }
    });
    if(!achievement){
      return res.status(404).json({
        message: 'Achievement not found!',
      });
    }
    return res.status(200).json(achievement);
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
      level: req.body.level,
      year: req.body.year,
      result: req.body.result,
    }
    await Achievement.create(data);
    return res.status(200).json({
      message: 'Achievement has been success!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      where: {
        id: req.params.id
      }
    });
    if(!achievement){
      return res.status(404).json({
        message: 'Achievement not found!',
      });
    }
    const data = {
      name: req.body.name,
      level: req.body.level,
      year: req.body.year,
      result: req.body.year,
    }
    await Achievement.update(data, {
      where: {
        id: req.params.id,
      }
    });
    return res.status(200).json({
      message: 'Achievement has been updated!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Achievement.destroy({
      where: {
        id: req.params.id
      }
    });
    return res.status(200).json({
      message: 'Achievement has been deleted!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;