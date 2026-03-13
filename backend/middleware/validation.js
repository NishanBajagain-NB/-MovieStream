const { body, query, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Admin login validation
const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Movie validation
const validateMovie = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Movie name is required and must be less than 255 characters'),
  body('poster')
    .optional()
    .isURL()
    .withMessage('Poster must be a valid URL'),
  body('release_date')
    .optional()
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Genre must be less than 255 characters'),
  body('playtime')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Playtime must be less than 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('servers')
    .optional()
    .isArray()
    .withMessage('Servers must be an array'),
  body('servers.*.server_name')
    .if(body('servers').exists())
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Server name is required and must be less than 100 characters'),
  body('servers.*.server_url')
    .if(body('servers').exists())
    .isURL()
    .withMessage('Server URL must be a valid URL'),
  handleValidationErrors
];

// Ad validation
const validateAd = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Ad name is required and must be less than 255 characters'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('ad_code')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Ad code must be less than 5000 characters'),
  body('redirect_link')
    .optional()
    .isURL()
    .withMessage('Redirect link must be a valid URL'),
  body('position')
    .isIn(['top', 'sidebar', 'bottom'])
    .withMessage('Position must be one of: top, sidebar, bottom'),
  body('enabled')
    .optional()
    .isBoolean()
    .withMessage('Enabled must be a boolean'),
  // Custom validation: either image_url or ad_code must be provided
  body().custom((value) => {
    if (!value.image_url && !value.ad_code) {
      throw new Error('Either image_url or ad_code must be provided');
    }
    return true;
  }),
  handleValidationErrors
];

// Popup settings validation
const validatePopupSettings = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('discord_link')
    .optional()
    .isURL()
    .withMessage('Discord link must be a valid URL'),
  body('facebook_link')
    .optional()
    .isURL()
    .withMessage('Facebook link must be a valid URL'),
  body('twitter_link')
    .optional()
    .isURL()
    .withMessage('Twitter link must be a valid URL'),
  body('enabled')
    .optional()
    .isBoolean()
    .withMessage('Enabled must be a boolean'),
  handleValidationErrors
];

// Site settings validation
const validateSiteSettings = [
  body('site_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Site name must be less than 255 characters'),
  body('site_description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Site description must be less than 1000 characters'),
  body('site_logo')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value && value.trim() !== '') {
        return /^https?:\/\/.+/.test(value);
      }
      return true;
    })
    .withMessage('Site logo must be a valid URL'),
  body('favicon')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value && value.trim() !== '') {
        return /^https?:\/\/.+/.test(value);
      }
      return true;
    })
    .withMessage('Favicon must be a valid URL'),
  body('primary_color')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Primary color must be a valid hex color'),
  body('footer_text')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Footer text must be less than 500 characters'),
  body('contact_email')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value && value.trim() !== '') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      return true;
    })
    .withMessage('Contact email must be a valid email'),
  body('maintenance_mode')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('Maintenance mode must be a boolean'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateAdminLogin,
  validateMovie,
  validateAd,
  validatePopupSettings,
  validateSiteSettings,
  validateSearch,
  validateId,
  handleValidationErrors
};