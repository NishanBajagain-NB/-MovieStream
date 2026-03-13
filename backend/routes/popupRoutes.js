const express = require('express');
const router = express.Router();
const {
  getPopupSettings,
  updatePopupSettings
} = require('../controllers/popupController');
const { verifyToken } = require('../middleware/auth');
const { validatePopupSettings } = require('../middleware/validation');

// Public routes
router.get('/', getPopupSettings);

// Admin routes (protected)
router.put('/', verifyToken, validatePopupSettings, updatePopupSettings);

module.exports = router;