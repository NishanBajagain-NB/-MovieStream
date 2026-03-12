const express = require('express');
const router = express.Router();
const {
  getAllAds,
  getAdsByPosition,
  createAd,
  updateAd,
  deleteAd,
  trackClick,
  trackImpression
} = require('../controllers/adsController');
const { verifyToken } = require('../middleware/auth');
const { validateAd, validateId } = require('../middleware/validation');

// Public routes
router.get('/', getAllAds);
router.get('/position/:position', getAdsByPosition);
router.post('/:id/click', validateId, trackClick);
router.post('/:id/impression', validateId, trackImpression);

// Admin routes (protected)
router.post('/', verifyToken, validateAd, createAd);
router.put('/:id', verifyToken, validateId, validateAd, updateAd);
router.delete('/:id', verifyToken, validateId, deleteAd);

module.exports = router;