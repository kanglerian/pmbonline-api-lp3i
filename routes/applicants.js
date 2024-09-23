const express = require('express');
const router = express.Router();
const verifytoken = require('../middlewares/verifytoken');

const { User, Applicant, ApplicantFamily, School } = require('../models');
const { body, validationResult } = require('express-validator');

/* GET applicants listing. */
router.get('/', verifytoken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await Applicant.findAll({
      limit: limit,
      offset: offset,
    });

    const totalItems = await Applicant.count();
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

/* Use for PPO */
router.patch('/update/v1/:identity', verifytoken, [
  body('name')
    .isLength({ min: 1 }).withMessage('name cannot be at least 1 characters long')
    .isLength({ max: 150 }).withMessage('name cannot be more than 150 characters long')
    .notEmpty().withMessage('name is required'),
  body('gender')
    .notEmpty().withMessage('gender is required'),
  body('place_of_birth')
    .notEmpty().withMessage('place of birth is required'),
  body('date_of_birth')
    .notEmpty().withMessage('date of birth is required'),
  body('religion')
    .notEmpty().withMessage('religion is required'),
  body('school')
    .notEmpty().withMessage('school is required'),
  body('major')
    .isLength({ min: 1 }).withMessage('major cannot be at least 1 characters long')
    .isLength({ max: 100 }).withMessage('major cannot be more than 100 characters long')
    .notEmpty().withMessage('major is required'),
  body('class')
    .isLength({ min: 1 }).withMessage('class cannot be at least 1 characters long')
    .isLength({ max: 100 }).withMessage('class cannot be more than 100 characters long')
    .notEmpty().withMessage('class is required'),
  body('year')
    .isLength({ min: 4, max: 4 }).withMessage('year must be exactly 4 characters long')
    .notEmpty().withMessage('year is required'),
  body('income_parent')
    .notEmpty().withMessage('income parent is required'),
  body('social_media')
    .isLength({ max: 35 }).withMessage('social media cannot be more than 35 characters long')
    .notEmpty().withMessage('social media is required'),
  body('rt')
    .isLength({ max: 3 }).withMessage('RT cannot be more than 3 characters long'),
  body('rw')
    .isLength({ max: 3 }).withMessage('RW cannot be more than 3 characters long'),
  body('postal_code')
    .isLength({ max: 5 }).withMessage('postal code cannot be more than 5 characters long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      where: {
        identity: req.params.identity
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'user not found.'
      });
    }

    const applicant = await Applicant.findOne({
      where: {
        identity: req.params.identity
      }
    });

    if (!applicant) {
      return res.status(404).json({
        message: 'applicant not found.'
      });
    }

    const capitalizeWords = (str) => {
      if (str === undefined) {
        return 'undefined';
      } else {
        str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return (str);
      }
    }

    const place = req.body.place !== null ? capitalizeWords(req.body.place) + ', ' : null;
    const rt = req.body.rt !== null ? 'RT. ' + req.body.rt + ' ' : null;
    const rw = req.body.rw !== null ? 'RW. ' + req.body.rw + ', ' : null;
    const kel = req.body.village !== null ? 'Desa/Kelurahan ' + capitalizeWords(req.body.village) + ', ' : null;
    const kec = req.body.district !== null ? 'Kecamatan ' + capitalizeWords(req.body.district) + ', ' : null;
    const reg = req.body.regency !== null ? 'Kota/Kabupaten ' + capitalizeWords(req.body.regency) + ', ' : null;
    const prov = req.body.province !== null ? 'Provinsi ' + capitalizeWords(req.body.province) + ', ' : null;
    const postal = req.body.postal_code !== null ? 'Kode Pos ' + req.body.postal_code : null;
    const addressRequest = place + rt + rw + kel + kec + reg + prov + postal;

    const schoolCheck = await School.findOne({
      where: {
        id: req.body.school
      }
    });

    const schoolNameCheck = await School.findOne({
      where: {
        name: req.body.school
      }
    });

    var school;

    if (schoolCheck) {
      school = schoolCheck.id;
    } else {
      if (schoolNameCheck) {
        school = schoolNameCheck.id;
      } else {
        const dataSchool = {
          name: req.body.school.toUpperCase(),
          region: 'TIDAK DIKETAHUI'
        }
        const schoolCreate = await School.create(dataSchool);
        school = schoolCreate.id;
      }
    }

    if (req.body.place && req.body.rt && req.body.rw && req.body.postal_code) {
      if (req.body.address == addressRequest) {
        address = req.body.address;
      } else {
        address = addressRequest;
      }
    } else {
      address = applicant.address;
    }

    const data = {
      name: req.body.name,
      gender: req.body.gender,
      placeOfBirth: req.body.place_of_birth,
      dateOfBirth: req.body.date_of_birth,
      religion: req.body.religion,
      school: school,
      major: req.body.major,
      class: req.body.class,
      year: req.body.year,
      incomeParent: req.body.income_parent,
      socialMedia: req.body.social_media,
      address: address,
    }

    const dataUser = {
      name: req.body.name,
      gender: req.body.gender,
    }

    await Applicant.update(data, {
      where: {
        id: applicant.id,
      }
    });

    await User.update(dataUser, {
      where: {
        id: user.id,
      }
    });

    return res.status(200).json({
      message: 'Personal data updated successfully!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

/* Use for PPO */
router.patch('/updateprodi/v1/:identity', verifytoken, [
  body('program')
    .notEmpty().withMessage('program is required'),
  body('program_second')
    .notEmpty().withMessage('program second is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const applicant = await Applicant.findOne({
      where: {
        identity: req.params.identity
      }
    });

    if (!applicant) {
      return res.status(404).json({
        message: 'applicant not found.'
      });
    }

    const data = {
      program: req.body.program,
      programSecond: req.body.program_second,
      programtypeId: 1,
    }

    await Applicant.update(data, {
      where: {
        id: applicant.id,
      }
    });

    return res.status(200).json({
      message: 'Program study data updated successfully!'
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

/* Use for PPO */
router.patch('/updatefamily/v1/:identity', verifytoken, [
  /* Validation Father */
  body('father_name')
    .isLength({ min: 1 }).withMessage('father name cannot be at least 1 characters long')
    .isLength({ max: 150 }).withMessage('father name cannot be more than 150 characters long')
    .notEmpty().withMessage('father name is required'),
  body('father_job')
    .isLength({ min: 1 }).withMessage('father job cannot be at least 1 characters long')
    .isLength({ max: 150 }).withMessage('father job cannot be more than 150 characters long')
    .notEmpty().withMessage('father job is required'),
  body('father_phone')
    .isLength({ min: 12 }).withMessage('father phone cannot be at least 1 characters long')
    .isLength({ max: 14 }).withMessage('father phone cannot be more than 150 characters long')
    .isMobilePhone('id-ID').withMessage('Phone number must be a valid Indonesian phone number')
    .notEmpty().withMessage('father phone is required'),
  body('father_place_of_birth')
    .notEmpty().withMessage('father place of birth is required'),
  body('father_date_of_birth')
    .notEmpty().withMessage('father date of birth is required'),
  body('father_education')
    .notEmpty().withMessage('father education is required'),
  body('father_rt')
    .isLength({ max: 3 }).withMessage('father RT cannot be more than 3 characters long'),
  body('father_rw')
    .isLength({ max: 3 }).withMessage('father RW cannot be more than 3 characters long'),
  body('father_rt_postal_code')
    .isLength({ max: 5 }).withMessage('father postal code must be exactly 5 characters long'),
  /* Validation Mother */
  body('mother_name')
    .isLength({ min: 1 }).withMessage('mother name cannot be at least 1 characters long')
    .isLength({ max: 150 }).withMessage('mother name cannot be more than 150 characters long')
    .notEmpty().withMessage('mother name is required'),
  body('mother_job')
    .isLength({ min: 1 }).withMessage('mother job cannot be at least 1 characters long')
    .isLength({ max: 150 }).withMessage('mother job cannot be more than 150 characters long')
    .notEmpty().withMessage('mother job is required'),
  body('mother_phone')
    .isLength({ min: 12 }).withMessage('mother phone cannot be at least 1 characters long')
    .isLength({ max: 14 }).withMessage('mother phone cannot be more than 150 characters long')
    .isMobilePhone('id-ID').withMessage('Phone number must be a valid Indonesian phone number')
    .notEmpty().withMessage('mother phone is required'),
  body('mother_place_of_birth')
    .notEmpty().withMessage('mother place of birth is required'),
  body('mother_date_of_birth')
    .notEmpty().withMessage('mother date of birth is required'),
  body('mother_education')
    .notEmpty().withMessage('mother education is required'),
  body('mother_rt')
    .isLength({ max: 3 }).withMessage('mother RT cannot be more than 3 characters long'),
  body('mother_rw')
    .isLength({ max: 3 }).withMessage('mother RW cannot be more than 3 characters long'),
  body('mother_rt_postal_code')
    .isLength({ max: 5 }).withMessage('mother postal code must be exactly 5 characters long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const father = await ApplicantFamily.findOne({
      where: {
        identityUser: req.params.identity,
        gender: true
      }
    });

    if (!father) {
      return res.status(404).json({
        message: 'father not found.'
      });
    }

    const mother = await ApplicantFamily.findOne({
      where: {
        identityUser: req.params.identity,
        gender: false
      }
    });

    if (!mother) {
      return res.status(404).json({
        message: 'mother not found.'
      });
    }

    const capitalizeWords = (str) => {
      if (str === undefined) {
        return 'undefined';
      } else {
        str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return (str);
      }
    }

    /* Father */
    const fatherPlace = req.body.father_place !== null ? capitalizeWords(req.body.father_place) + ', ' : null;
    const fatherRt = req.body.father_rt !== null ? 'RT. ' + req.body.father_rt + ' ' : null;
    const fatherRw = req.body.father_rw !== null ? 'RW. ' + req.body.father_rw + ', ' : null;
    const fatherKel = req.body.father_village !== null ? 'Desa/Kelurahan ' + capitalizeWords(req.body.father_village) + ', ' : null;
    const fatherKec = req.body.father_district !== null ? 'Kecamatan ' + capitalizeWords(req.body.father_district) + ', ' : null;
    const fatherReg = req.body.father_regency !== null ? 'Kota/Kabupaten ' + capitalizeWords(req.body.father_regency) + ', ' : null;
    const fatherProv = req.body.father_province !== null ? 'Provinsi ' + capitalizeWords(req.body.father_province) + ', ' : null;
    const fatherPostal = req.body.father_postal_code !== null ? 'Kode Pos ' + req.body.father_postal_code : null;
    const fatherAddressRequest = fatherPlace + fatherRt + fatherRw + fatherKel + fatherKec + fatherReg + fatherProv + fatherPostal;

    /* Mother */
    const motherPlace = req.body.mother_place !== null ? capitalizeWords(req.body.mother_place) + ', ' : null;
    const motherRt = req.body.mother_rt !== null ? 'RT. ' + req.body.mother_rt + ' ' : null;
    const motherRw = req.body.mother_rw !== null ? 'RW. ' + req.body.mother_rw + ', ' : null;
    const motherKel = req.body.mother_village !== null ? 'Desa/Kelurahan ' + capitalizeWords(req.body.mother_village) + ', ' : null;
    const motherKec = req.body.mother_district !== null ? 'Kecamatan ' + capitalizeWords(req.body.mother_district) + ', ' : null;
    const motherReg = req.body.mother_regency !== null ? 'Kota/Kabupaten ' + capitalizeWords(req.body.mother_regency) + ', ' : null;
    const motherProv = req.body.mother_province !== null ? 'Provinsi ' + capitalizeWords(req.body.mother_province) + ', ' : null;
    const motherPostal = req.body.mother_postal_code !== null ? 'Kode Pos ' + req.body.mother_postal_code : null;
    const motherAddressRequest = motherPlace + motherRt + motherRw + motherKel + motherKec + motherReg + motherProv + motherPostal;

    var fatherAddress;
    var motherAddress;

    if (req.body.father_place && req.body.father_rt && req.body.father_rw && req.body.father_postal_code) {
      if (req.body.father_address == fatherAddressRequest) {
        fatherAddress = req.body.father_address;
      } else {
        fatherAddress = fatherAddressRequest;
      }
    } else {
      fatherAddress = father.address;
    }

    if (req.body.mother_place && req.body.mother_rt && req.body.mother_rw && req.body.mother_postal_code) {
      if (req.body.mother_address == motherAddressRequest) {
        motherAddress = req.body.mother_address;
      } else {
        motherAddress = motherAddressRequest;
      }
    } else {
      motherAddress = mother.address;
    }

    const dataFather = {
      name: req.body.father_name,
      job: req.body.father_job,
      phone: req.body.father_phone,
      placeOfBirth: req.body.father_place_of_birth,
      dateOfBirth: req.body.father_date_of_birth,
      education: req.body.father_education,
      address: fatherAddress,
    }

    const dataMother = {
      name: req.body.mother_name,
      job: req.body.mother_job,
      phone: req.body.mother_phone,
      placeOfBirth: req.body.mother_place_of_birth,
      dateOfBirth: req.body.mother_date_of_birth,
      education: req.body.mother_education,
      address: motherAddress,
    }

    await ApplicantFamily.update(dataFather, {
      where: {
        id: father.id,
      }
    });

    await ApplicantFamily.update(dataMother, {
      where: {
        id: mother.id,
      }
    });

    return res.status(200).json({
      message: 'Parent data updated successfully!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;