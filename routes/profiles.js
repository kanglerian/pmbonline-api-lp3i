const express = require('express');
const router = express.Router();
const {
  User,
  Applicant,
  School,
  ApplicantFamily,
  UserUpload,
  FileUpload
} = require('../models');
const verifytoken = require('../middlewares/verifytoken');
const { Op } = require('sequelize');

const getFileUploadByType = async (identityUser, fileType) => {
  return await UserUpload.findOne({
    where: { identity_user: identityUser },
    include: {
      model: FileUpload,
      as: 'fileupload',
      where: { namefile: fileType }
    }
  });
}

const validateApplicantData = (applicant) => {
  return applicant.name &&
    applicant.gender !== null &&
    applicant.placeOfBirth &&
    applicant.dateOfBirth &&
    applicant.religion &&
    applicant.school &&
    applicant.major &&
    applicant.class &&
    applicant.year &&
    applicant.incomeParent &&
    applicant.socialMedia &&
    applicant.address
};

const validateApplicantProgram = (applicant) => {
  return applicant.program && applicant.programSecond;
};

const validateApplicantFather = (father) => {
  return father.name &&
    father.placeOfBirth &&
    father.dateOfBirth &&
    father.phone &&
    father.education &&
    father.job &&
    father.address
};

const validateApplicantMother = (mother) => {
  return mother.name &&
    mother.placeOfBirth &&
    mother.dateOfBirth &&
    mother.phone &&
    mother.education &&
    mother.job &&
    mother.address
};

/* GET profiles listing. */
router.get('/', verifytoken, async (req, res) => {
  try {
    const identityUser = req.user.data.identity;
    const applicant = await Applicant.findOne({
      where: {
        identity: identityUser
      },
      include: [
        { model: School, as: 'schools' }
      ]
    });

    const father = await ApplicantFamily.findOne({
      where: {
        identity_user: identityUser,
        gender: true
      },
    });

    const mother = await ApplicantFamily.findOne({
      where: {
        identity_user: identityUser,
        gender: false
      },
    });

    const userUpload = await UserUpload.findAll({
      where: {
        identity_user: identityUser,
      },
      include: [
        { model: FileUpload, as: 'fileupload' }
      ],
    });

    const fileuploadIds = userUpload.map(upload => upload.fileuploadId);

    const fileuploaded = await FileUpload.findAll({
      where: {
        id: fileuploadIds
      }
    });

    const fileupload = await FileUpload.findAll({
      where: {
        id: {
          [Op.notIn]: fileuploadIds
        },
        namefile: {
          [Op.in]: [
            "foto",
            "akta-kelahiran",
            "kartu-keluarga",
            "sertifikat-pendukung",
            "foto-rumah-luar-dan-dalam",
            "bukti-tarif-daya-listrik",
          ]
        }
      }
    });

    const foto = await getFileUploadByType(identityUser, 'foto');
    const aktaKelahiran = await getFileUploadByType(identityUser, 'akta-kelahiran');
    const sertifikatPendukung = await getFileUploadByType(identityUser, 'sertifikat-pendukung');
    const fotoRumah = await getFileUploadByType(identityUser, 'foto-rumah-luar-dan-dalam');
    const buktiTarifDaya = await getFileUploadByType(identityUser, 'bukti-tarif-daya-listrik');

    const isValidData = validateApplicantData(applicant);
    const isValidProgram = validateApplicantProgram(applicant);
    const isValidFather = validateApplicantFather(father);
    const isValidMother = validateApplicantMother(mother);
    const isValidFiles = foto && aktaKelahiran && sertifikatPendukung;

    console.log(isValidMother);

    return res.status(200).json(buktiTarifDaya);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;