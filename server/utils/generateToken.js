const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'volunteer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'ngo_lms_secret_2026',
    {
      expiresIn: '3h'
    }
  );
};

module.exports = generateToken;
