const express = require('express');
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings
} = require('../controllers/siteController');
const { verifyToken } = require('../middleware/auth');
const { validateSiteSettings } = require('../middleware/validation');

// Public routes
router.get('/', getSiteSettings);

// Admin routes (protected)
router.put('/', verifyToken, validateSiteSettings, updateSiteSettings);

module.exports = router;