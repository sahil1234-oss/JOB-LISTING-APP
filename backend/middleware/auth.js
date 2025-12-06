// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// load secret safely
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Middleware
module.exports = function (req, res, next) {
  // Both lowercase and uppercase headers supported
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Required format: "Bearer <token>"
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // attach user ID to request
    next(); // allow request to continue
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
