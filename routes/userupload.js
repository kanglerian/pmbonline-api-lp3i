const express = require('express');
const router = express.Router();
const { User, UserUpload, FileUpload } = require('../models');
const verifytoken = require('../middlewares/verifytoken');

/* Create history upload */
router.post('/', verifytoken, async (req, res) => {
  try {
    const data = {
      identityUser: req.user.data.identity,
      fileuploadId: req.body.fileupload_id,
      typefile: req.body.typefile,
    }

    if (data.fileuploadId === "1") {
      const file = await FileUpload.findOne({
        where: {
          id: data.fileuploadId
        }
      });
      const dataFoto = {
        avatar: `${file.namefile}.${data.typefile}`
      }
      await User.update(dataFoto, {
        where: {
          identity: data.identityUser,
          role: 'S'
        }
      });
    }

    await UserUpload.create(data);
    return res.status(200).json({
      message: 'Upload has been success!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

/* GET users listing. */
router.delete('/:identity', verifytoken, async (req, res) => {
  try {
    const file = await UserUpload.findOne({
      where: {
        id: req.params.identity
      },
      include: [
        { model: FileUpload, as: 'fileupload' }
      ]
    });
    if (!file) {
      return res.status(404).json({
        message: 'File not found!',
      });
    }

    if (file.fileupload.namefile == 'foto') {
      await User.update({ avatar: null }, {
        where: {
          identity: file.identityUser,
        }
      });
    }
    await file.destroy();
    return res.status(200).json({
      message: 'Upload has been deleted!',
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
});

module.exports = router;