const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is set
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('ERROR: JWT_SECRET must be set and at least 32 characters long');
  process.exit(1);
}
const TOKEN_EXPIRES_IN = '7d';

module.exports = {
  signToken: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }),
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
  hashPassword: async (plain) => await bcrypt.hash(plain, 10),
  comparePassword: async (plain, hash) => await bcrypt.compare(plain, hash),
};
