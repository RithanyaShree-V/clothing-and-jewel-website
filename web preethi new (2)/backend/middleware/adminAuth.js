const jwt = require('jsonwebtoken');

// @desc    Protect routes - verify admin token
const protectAdmin = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. Please login as admin.'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please login again.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

// @desc    Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'super-admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as admin.'
    });
  }
};

module.exports = { protectAdmin, isAdmin };
