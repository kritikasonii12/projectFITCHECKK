const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fitcheck_dev_secret_change_me';

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired session, please log in again' });
  }
};

module.exports.JWT_SECRET = JWT_SECRET;
