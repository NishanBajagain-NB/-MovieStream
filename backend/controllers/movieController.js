const Movie = require('../models/Movie');

// Get all movies with pagination and search
const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.q || '';
    
    const result = await Movie.getAll(page, limit, search);
    
    res.json({
      success: true,
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all movies error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.getById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get newly added movies
const getNewlyAddedMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const movies = await Movie.getNewlyAdded(limit);
    
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get newly added movies error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search movies
const searchMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.q || '';
    
    if (!search.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const result = await Movie.getAll(page, limit, search);
    
    res.json({
      success: true,
      data: result.movies,
      pagination: result.pagination,
      query: search
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new movie (Admin only)
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update movie (Admin only)
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.update(id, req.body);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete movie (Admin only)
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Movie.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get movie statistics (Admin only)
const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get movie stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getNewlyAddedMovies,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats
};