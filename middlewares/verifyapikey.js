require('dotenv').config();

const { LP3I_API_KEY } = process.env;

module.exports = async (req, res, next) => {
  const key = req.headers['lp3i-api-key'];
  if (!key || key !== LP3I_API_KEY) {
    return res.status(403).json({
      message: 'Invalid API Key'
    });
  }
  next();
}