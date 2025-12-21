// const jwt = require('jsonwebtoken');

// exports.authenticateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token missing' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }

//     // Attach user id to request
//     req.user = { id: decoded.userId };
//     next();
//   });
// };



const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// =====================
// Authenticate JWT
// =====================
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: load role from DB
    const result = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user info for controllers & role checks
    req.user = {
      id: result.rows[0].id,
      role: result.rows[0].role
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// =====================
// Role-based Authorization
// =====================
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
