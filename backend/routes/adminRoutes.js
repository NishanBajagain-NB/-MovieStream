const express = require('express');
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile,
  getDashboardStats
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { validateAdminLogin } = require('../middleware/validation');

// Public routes
router.post('/login', validateAdminLogin, login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/dashboard/stats', verifyToken, getDashboardStats);

module.exports = router;