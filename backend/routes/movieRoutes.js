const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  getNewlyAddedMovies,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats
} = require('../controllers/movieController');
const { verifyToken } = require('../middleware/auth');
const { validateMovie, validateSearch, validateId } = require('../middleware/validation');

// Public routes
router.get('/', validateSearch, getAllMovies);
router.get('/newly-added', getNewlyAddedMovies);
router.get('/search', validateSearch, searchMovies);
router.get('/:id', validateId, getMovieById);

// Admin routes (protected)
router.post('/', verifyToken, validateMovie, createMovie);
router.put('/:id', verifyToken, validateId, validateMovie, updateMovie);
router.delete('/:id', verifyToken, validateId, deleteMovie);
router.get('/admin/stats', verifyToken, getMovieStats);

module.exports = router;