require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const verifyToken = require('../middlewares/verifytoken');

const { JWT_SECRET, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRED, JWT_REFRESH_TOKEN_EXPIRED } = process.env;

const { User, Applicant, ApplicantFamily, School } = require('../models');
const { body, validationResult } = require('express-validator');

function getYearPMB() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startYear = currentMonth >= 9 ? currentYear + 1 : currentYear;
  return startYear;
}

function capitalizeFirstLetter(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeName(name) {
  return name
    .split(' ')
    .map(part => capitalizeFirstLetter(part))
    .join(' ');
}

router.get('/', (req, res) => {
  try {
    return res.send('Authentication PMB Online 🇮🇩');
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login/v1', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check the email address and try again.' });
    }

    const hashPass = /^\$2y\$/.test(user.password) ? '$2b$' + user.password.slice(4) : user.password;

    const match = await bcrypt.compare(req.body.password, hashPass);

    if (!match) {
      return res.status(401).json({ message: 'Invalid password. Please check the password and try again.' });
    }

    const payload = {
      identity: user.identity,
      name: user.name,
      email: user.email
    }

    const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
    const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

    await User.update({
      token: refreshTokenPMBOnline,
    }, {
      where: {
        id: user.id
      }
    });

    res.cookie('refreshTokenPMBOnlineV1', refreshTokenPMBOnline, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      token: token,
      refresh_token: refreshTokenPMBOnline,
      message: 'Login successful!'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login/v2', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check the email address and try again.' });
    }

    const hashPass = /^\$2y\$/.test(user.password) ? '$2b$' + user.password.slice(4) : user.password;

    const match = await bcrypt.compare(req.body.password, hashPass);

    if (!match) {
      return res.status(401).json({ message: 'Invalid password. Please check the password and try again.' });
    }

    const payload = {
      id: user.id,
      identity: user.identity,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    }

    const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
    const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

    await User.update({
      token: refreshTokenPMBOnline,
    }, {
      where: {
        id: user.id
      }
    });

    res.cookie('refreshTokenPMBOnlineV2', refreshTokenPMBOnline, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      token: token,
      refresh_token: refreshTokenPMBOnline,
      message: 'Login successful!'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/* Use for PPO */
router.post('/register/v1', [
  body('name')
    .isLength({ max: 150 }).withMessage('name cannot be more than 150 characters long')
    .notEmpty().withMessage('name is required')
  ,
  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .isLength({ max: 100 }).withMessage('email cannot be more than 100 characters long')
    .notEmpty().withMessage('email is required')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          email: value
        }
      });
      if (user) {
        return Promise.reject('Email already in use');
      }
    }),
  body('phone')
    .notEmpty().withMessage('phone is required')
    .isLength({ min: 12 }).withMessage('phone cannot be at least 12 characters long')
    .isLength({ max: 15 }).withMessage('phone cannot be more than 15 characters long')
    .isMobilePhone('id-ID').withMessage('Phone number must be a valid Indonesian phone number')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          phone: value
        }
      });
      if (user) {
        return Promise.reject('Phone already in use');
      }
    }),
  body('information')
    .notEmpty().withMessage('information is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, phone, information } = req.body;

    const applicant = await Applicant.findOne({
      where: {
        phone: phone
      }
    });

    if (applicant) {
      const dataApplicant = {
        email: email,
        isApplicant: true,
        programtypeId: 3,
        sourceDaftarId: 12,
        statusId: 1,
        followupId: 1,
      }

      const hashPassword = await bcrypt.hash(phone, 10);

      const dataUser = {
        identity: applicant.identity,
        name: applicant.name,
        email: email,
        phone: applicant.phone,
        password: hashPassword,
        role: 'S',
        status: true
      }

      const userCreated = await User.create(dataUser);
      await Applicant.update(dataApplicant, {
        where: {
          id: applicant.id
        }
      });

      const payload = {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        phone: userCreated.phone,
        role: userCreated.role,
        status: userCreated.status
      }

      const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

      await User.update({
        token: refreshTokenPMBOnline,
      }, {
        where: {
          id: userCreated.id
        }
      });

      res.cookie('refreshTokenPMBOnlineV1', refreshTokenPMBOnline, {
        httpOnly: true,
        secure: false,
      });

      return res.status(200).json({
        token: token,
        refresh_token: refreshTokenPMBOnline,
        message: 'Registration successful!'
      });
    } else {
      const identityUser = uuidv4();
      const presenter = await User.findOne({
        where: {
          role: 'P',
          phone: information
        }
      });

      const dataApplicant = {
        identity: identityUser,
        name: capitalizeName(name),
        email: email,
        phone: phone,
        pmb: getYearPMB(),
        identityUser: presenter ? information : '6281313608558',
        isApplicant: true,
        programtypeId: 3,
        sourceId: 12,
        sourceDaftarId: 12,
        statusId: 1,
        followupId: 1,
      }

      const hashPassword = await bcrypt.hash(phone, 10);

      const dataUser = {
        identity: identityUser,
        name: capitalizeName(name),
        email: email,
        phone: phone,
        password: hashPassword,
        role: 'S',
        status: true
      }

      const dataFather = {
        identityUser: identityUser,
        gender: true
      }

      const dataMother = {
        identityUser: identityUser,
        gender: false
      }

      const userCreated = await User.create(dataUser);
      await Applicant.create(dataApplicant);
      await ApplicantFamily.create(dataFather);
      await ApplicantFamily.create(dataMother);

      const payload = {
        id: userCreated.id,
        identity: userCreated.identity,
        name: userCreated.name,
        email: userCreated.email,
        phone: userCreated.phone,
        role: userCreated.role,
        status: userCreated.status
      }

      const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

      await User.update({
        token: refreshTokenPMBOnline,
      }, {
        where: {
          id: userCreated.id
        }
      });

      res.cookie('refreshTokenPMBOnlineV1', refreshTokenPMBOnline, {
        httpOnly: true,
        secure: false,
      });

      return res.status(200).json({
        token: token,
        refresh_token: refreshTokenPMBOnline,
        message: 'Registration successful!'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/* use for TGB, Psikotest */
router.post('/register/v2', [
  body('name')
    .isLength({ max: 150 }).withMessage('name cannot be more than 150 characters long')
    .notEmpty().withMessage('name is required')
  ,
  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .isLength({ max: 100 }).withMessage('email cannot be more than 100 characters long')
    .notEmpty().withMessage('email is required')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          email: value
        }
      });
      if (user) {
        return Promise.reject('Email already in use');
      }
    }),
  body('phone')
    .notEmpty().withMessage('phone is required')
    .isLength({ min: 12 }).withMessage('phone cannot be at least 12 characters long')
    .isLength({ max: 15 }).withMessage('phone cannot be more than 15 characters long')
    .isMobilePhone('id-ID').withMessage('Phone number must be a valid Indonesian phone number')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          phone: value
        }
      });
      if (user) {
        return Promise.reject('Phone already in use');
      }
    }),
  body('information')
    .notEmpty().withMessage('information is required'),
  body('school')
    .notEmpty().withMessage('school is required'),
  body('classes')
    .notEmpty().withMessage('class is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, phone, school, classes, information } = req.body;

    const schoolCheck = await School.findOne({
      where: { id: school }
    });

    const schoolNameCheck = await School.findOne({
      where: { name: school }
    });

    var schoolVal;

    if (schoolCheck) {
      schoolVal = schoolCheck.id;
    } else {
      if (schoolNameCheck) {
        schoolVal = schoolNameCheck.id;
      } else {
        const dataSchool = {
          name: school.toUpperCase(),
          region: 'TIDAK DIKETAHUI'
        }

        const schoolCreate = await School.create(dataSchool);
        schoolVal = schoolCreate.id;
      }
    }

    const applicant = await Applicant.findOne({
      where: {
        phone: phone
      }
    });

    if (applicant) {
      const dataApplicant = {
        school: schoolVal,
        class: classes,
        email: email,
        isApplicant: true,
        programtypeId: 3,
        sourceDaftarId: 11,
        statusId: 1,
        followupId: 1,
      }

      const hashPassword = await bcrypt.hash(phone, 10);

      const dataUser = {
        identity: applicant.identity,
        name: applicant.name,
        email: email,
        phone: applicant.phone,
        password: hashPassword,
        role: 'S',
        status: true
      }

      const userCreated = await User.create(dataUser);
      await Applicant.update(dataApplicant, {
        where: {
          id: applicant.id
        }
      });

      const payload = {
        id: userCreated.id,
        identity: userCreated.identity,
        name: userCreated.name,
        email: userCreated.email,
        phone: userCreated.phone,
        role: userCreated.role,
        status: userCreated.status
      }

      const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

      await User.update({
        token: refreshTokenPMBOnline,
      }, {
        where: {
          id: userCreated.id
        }
      });

      res.cookie('refreshTokenPMBOnlineV2', refreshTokenPMBOnline, {
        httpOnly: true,
        secure: false,
      });

      return res.status(200).json({
        token: token,
        refresh_token: refreshTokenPMBOnline,
        message: 'Registration successful!'
      });
    } else {
      const identityUser = uuidv4();
      const presenter = await User.findOne({
        where: {
          role: 'P',
          phone: information
        }
      });

      const dataApplicant = {
        identity: identityUser,
        name: capitalizeName(name),
        email: email,
        school: schoolVal,
        class: classes,
        phone: phone,
        pmb: getYearPMB(),
        identityUser: presenter ? information : '6281313608558',
        isApplicant: true,
        programtypeId: 3,
        sourceId: 11,
        sourceDaftarId: 11,
        statusId: 1,
        followupId: 1,
      }

      const hashPassword = await bcrypt.hash(phone, 10);

      const dataUser = {
        identity: identityUser,
        name: capitalizeName(name),
        email: email,
        phone: phone,
        password: hashPassword,
        role: 'S',
        status: true
      }

      const dataFather = {
        identityUser: identityUser,
        gender: true
      }

      const dataMother = {
        identityUser: identityUser,
        gender: false
      }

      const userCreated = await User.create(dataUser);
      await Applicant.create(dataApplicant);
      await ApplicantFamily.create(dataFather);
      await ApplicantFamily.create(dataMother);

      const payload = {
        id: userCreated.id,
        identity: userCreated.identity,
        name: userCreated.name,
        email: userCreated.email,
        phone: userCreated.phone,
        role: userCreated.role,
        status: userCreated.status
      }

      const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      const refreshTokenPMBOnline = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

      await User.update({
        token: refreshTokenPMBOnline,
      }, {
        where: {
          id: userCreated.id
        }
      });

      res.cookie('refreshTokenPMBOnlineV2', refreshTokenPMBOnline, {
        httpOnly: true,
        secure: false,
      });

      return res.status(200).json({
        token: token,
        refresh_token: refreshTokenPMBOnline,
        message: 'Registration successful!'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/token', async (req, res) => {
  try {
    const refresh = await User.findOne({
      where: {
        token: req.body.refreshToken
      }
    });

    if (!refresh) {
      return res.status(400).json({ message: 'Refresh token not found.' });
    }

    jwt.verify(req.body.refreshToken, JWT_SECRET_REFRESH_TOKEN, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: error.message });
      }
      const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      return res.status(200).json(token);
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/validation', async (req, res) => {
  try {
    const { field, value } = req.body;
    const applicant = await Applicant.findOne({
      where: {
        [field]: value
      }
    });
    if (applicant) {
      const user = await User.findOne({
        where: {
          [field]: value
        }
      });
      if (user) {
        return res.status(200).json({
          message: 'Account found in users and applicant.',
          data: {
            name: applicant.name,
            email: applicant.email,
            phone: applicant.phone,
          },
          create: false,
        });
      } else {
        return res.status(404).json({
          message: 'Account found in applicant only.',
          data: {
            name: applicant.name,
            email: applicant.email,
            phone: applicant.phone,
          },
          create: true,
        });
      }
    } else {
      const user = await User.findOne({
        where: {
          [field]: value
        }
      });
      if (user) {
        return res.status(200).json({
          message: 'Account found in users and applicant. Found in user.',
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
          create: false,
        });
      } else {
        return res.status(404).json({
          message: 'Account not found in users and applicant.',
          data: null,
          create: true,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/logout/v1', verifyToken, async (req, res) => {
  try {
    await User.update({
      token: null
    }, {
      where: {
        identity: req.user.data.identity
      }
    });
    res.clearCookie('refreshTokenPMBOnlineV1');
    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/logout/v2', verifyToken, async (req, res) => {
  try {
    await User.update({
      token: null
    }, {
      where: {
        identity: req.user.data.identity
      }
    });
    res.clearCookie('refreshTokenPMBOnlineV2');
    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;