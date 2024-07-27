require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = require('../middlewares/verifytoken');

const { JWT_SECRET, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRED, JWT_REFRESH_TOKEN_EXPIRED } = process.env;

const { User } = require('../models');

router.get('/', (req, res) => {
  try {
    return res.send('Authentication PMB Online 🇮🇩');
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashPass = /^\$2y\$/.test(user.password) ? '$2b$' + user.password.slice(4) : user.password;

    const match = await bcrypt.compare(req.body.password, hashPass);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
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

    return res.status(200).json({
        token: token,
        refresh_token: refreshTokenPMBOnline,
        message: 'Login successful!'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(200).json({ message: 'Registration successful.' });
  } catch (error) {
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
    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
})

module.exports = router;