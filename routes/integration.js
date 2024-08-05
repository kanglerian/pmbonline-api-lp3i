const express = require('express');
const router = express.Router();
const { Applicant } = require('../models');

/* Integrate SIAKAD TO: register, prodi TO */
router.get('/v1', async (req, res) => {
  try {
    const response = await Applicant.findAll({
      where: {
        program: 'Vokasi 2 Tahun Teknik Otomotif'
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;