const express = require('express');
const router = express.Router();
const verifyapikey = require('../../../middlewares/verifyapikey');

const {
  User,
  Applicant,
  ApplicantStatus,
  School,
  SourceSetting,
  FollowUp,
  ProgramType,
} = require('../../../models');


/* GET applicant by program with query. */
router.get('/', verifyapikey,  async (req, res) => {
  try {
    const { program } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      isApplicant: true,
      isDaftar: true,
      isRegister: true
    }

    if(program){
      filters.program = program;
    }

    const response = await Applicant.findAll({
      where: filters,
      attributes: ['identity','pmb','nisn','name','gender','email','phone'],
      include: [
        { model: School, as: 'schoolapplicant', attributes: ['name','region'] },
        { model: User, as: 'presenter', attributes: ['identity','name','email','phone'] },
        { model: ApplicantStatus, as: 'applicantStatus', attributes: ['name'] },
        { model: SourceSetting, as: 'sourcesetting', attributes: ['name'] },
        { model: SourceSetting, as: 'sourcedaftarsetting', attributes: ['name'] },
        { model: FollowUp, as: 'followup', attributes: ['name'] },
        { model: ProgramType, as: 'programtype', attributes: ['name'] },
      ],
      limit: limit,
      offset: offset,
    });

    const totalItems = await Applicant.count({
      where: filters,
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