const bcrypt = require('bcryptjs');
const { pool } = require('../database/connection');
const { generateToken } = require('../middleware/auth');
const Movie = require('../models/Movie');

// Admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const [rows] = await pool.execute(
      'SELECT id, email, password FROM admins WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const admin = rows[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(admin.id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin.id,
          email: admin.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get admin profile
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update admin profile
const updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;
    
    // Get current admin data
    const [adminRows] = await pool.execute(
      'SELECT email, password FROM admins WHERE id = ?',
      [adminId]
    );
    
    if (adminRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    const admin = adminRows[0];
    
    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }
      
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }
    
    // Prepare update data
    const updateData = {};
    const updateParams = [];
    
    if (email && email !== admin.email) {
      // Check if email already exists
      const [emailRows] = await pool.execute(
        'SELECT id FROM admins WHERE email = ? AND id != ?',
        [email, adminId]
      );
      
      if (emailRows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      updateData.email = email;
      updateParams.push(email);
    }
    
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
      updateParams.push(hashedPassword);
    }
    
    // Update admin
    if (updateParams.length > 0) {
      const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      updateParams.push(adminId);
      
      await pool.execute(
        `UPDATE admins SET ${setClause} WHERE id = ?`,
        updateParams
      );
    }
    
    // Return updated profile
    const [updatedRows] = await pool.execute(
      'SELECT id, email, created_at FROM admins WHERE id = ?',
      [adminId]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedRows[0]
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get movie stats
    const movieStats = await Movie.getStats();
    
    // Get ads count
    const [adsRows] = await pool.execute('SELECT COUNT(*) as total FROM ads WHERE enabled = true');
    
    // Get total views
    const [viewsRows] = await pool.execute('SELECT SUM(views) as total_views FROM movies');
    
    // Get recent activity (recent movies)
    const [recentRows] = await pool.execute(`
      SELECT id, name, views, created_at 
      FROM movies 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: {
        total_movies: movieStats.total_movies,
        total_views: viewsRows[0].total_views || 0,
        active_ads: adsRows[0].total,
        recent_movies: recentRows
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  getDashboardStats
};