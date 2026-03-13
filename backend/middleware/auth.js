const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if admin still exists
      const [rows] = await pool.execute(
        'SELECT id, email FROM admins WHERE id = ?',
        [decoded.adminId]
      );
      
      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Admin not found.'
        });
      }
      
      req.admin = {
        id: decoded.adminId,
        email: rows[0].email
      };
      
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = {
  verifyToken,
  generateToken
};