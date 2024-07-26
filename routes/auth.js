require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = require('../middlewares/verifytoken');

const { JWT_SECRET, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRED, JWT_REFRESH_TOKEN_EXPIRED } = process.env;

const { User } = require('../models');

router.get('/', (req, res) => {
  res.send('Authentication PMB Online 🇮🇩');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email or password is empty!' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashPass = /^\$2y\$/.test(user.password) ? '$2b$' + user.password.slice(4) : user.password;

    const match = await bcrypt.compare(req.body.password, hashPass);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
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

    res.cookie('refreshTokenPMBOnline', refreshTokenPMBOnline, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        refresh_token: refreshTokenPMBOnline
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(200).json({
      message: 'Berhasil mendaftar!'
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/token', async (req, res) => {
  try {
    const refreshTokenPMBOnline = req.cookies.refreshTokenPMBOnline;

    if (!refreshTokenPMBOnline) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid token'
      });
    }

    const refresh = await User.findOne({
      where: {
        token: refreshTokenPMBOnline
      }
    });

    if (!refresh) {
      res.clearCookie('refreshTokenPMBOnline');
      return res.status(400).json({
        status: 'error',
        message: 'token not found'
      });
    }

    jwt.verify(refreshTokenPMBOnline, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        res.clearCookie('refreshTokenPMBOnline');
        return res.status(403).json({
          status: 'error',
          message: err.message
        });
      }

      const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      return res.status(200).json({
        status: 'success',
        data: {
          token,
        }
      });
    })

    return res.json(refreshTokenPMBOnline);
  } catch (error) {
    console.log(error);
  }
})

router.delete('/logout', verifyToken, async (req, res) => {
  try {
    await User.update({
      token: null
    }, {
      where: {
        identity: req.user.data.identity
      }
    });
    res.clearCookie('refreshTokenPMBOnline');
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil keluar!'
    });
  } catch (err) {
    console.log(err);
  } finally {
    console.log('Logout function');
  }
})

module.exports = router;