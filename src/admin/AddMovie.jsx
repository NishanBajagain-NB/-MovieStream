import { useState } from 'react';
import { Upload, Plus, X, Search } from 'lucide-react';
import { movieAPI } from '../services/api';

const AddMovie = () => {
  const [formData, setFormData] = useState({
    name: '',
    poster: '',
    releaseDate: '',
    rating: '',
    genre: '',
    playtime: '',
    tmdbId: '',
    description: '',
    servers: [
      { name: 'UpCloud', url: '' },
      { name: 'MegaCloud', url: '' },
      { name: 'StreamSB', url: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbSearchResults, setTmdbSearchResults] = useState([]);
  const [showTmdbResults, setShowTmdbResults] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // TMDB Search functionality
  const searchTMDB = async (query) => {
    if (!query.trim() || !TMDB_API_KEY) return;
    
    setTmdbLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
      );
      const data = await response.json();
      
      if (data.results) {
        setTmdbSearchResults(data.results.slice(0, 5)); // Show top 5 results
        setShowTmdbResults(true);
      }
    } catch (error) {
      console.error('TMDB search error:', error);
    } finally {
      setTmdbLoading(false);
    }
  };

  // Auto-fill from TMDB
  const fillFromTMDB = async (tmdbMovie) => {
    setTmdbLoading(true);
    try {
      // Get detailed movie info
      const detailResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${tmdbMovie.id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movieDetails = await detailResponse.json();
      
      // Convert runtime to readable format
      const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : '';
      
      // Convert genres to string
      const genres = movieDetails.genres ? movieDetails.genres.map(g => g.name).join(', ') : '';
      
      setFormData({
        ...formData,
        name: movieDetails.title || tmdbMovie.title,
        poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}` : '',
        releaseDate: movieDetails.release_date || tmdbMovie.release_date,
        rating: movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : '',
        genre: genres,
        playtime: runtime,
        tmdbId: tmdbMovie.id.toString(),
        description: movieDetails.overview || tmdbMovie.overview
      });
      
      setShowTmdbResults(false);
    } catch (error) {
      console.error('Error fetching TMDB details:', error);
    } finally {
      setTmdbLoading(false);
    }
  };

  const fetchFromTMDB = async () => {
    if (!formData.tmdbId || !TMDB_API_KEY) {
      alert('Please enter a TMDB ID or use the search feature');
      return;
    }
    
    setTmdbLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${formData.tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movieDetails = await response.json();
      
      if (movieDetails.id) {
        const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : '';
        const genres = movieDetails.genres ? movieDetails.genres.map(g => g.name).join(', ') : '';
        
        setFormData({
          ...formData,
          name: movieDetails.title,
          poster: movieDetails.poster_path ? `${TMDB_IMAGE_BASE}${movieDetails.poster_path}` : '',
          releaseDate: movieDetails.release_date,
          rating: movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : '',
          genre: genres,
          playtime: runtime,
          description: movieDetails.overview
        });
      } else {
        alert('Movie not found on TMDB');
      }
    } catch (error) {
      console.error('Error fetching from TMDB:', error);
      alert('Error fetching movie data from TMDB');
    } finally {
      setTmdbLoading(false);
    }
  };

  const handleServerChange = (index, field, value) => {
    const updatedServers = [...formData.servers];
    updatedServers[index][field] = value;
    setFormData({
      ...formData,
      servers: updatedServers
    });
  };

  const addServer = () => {
    setFormData({
      ...formData,
      servers: [...formData.servers, { name: '', url: '' }]
    });
  };

  const removeServer = (index) => {
    const updatedServers = formData.servers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      servers: updatedServers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Movie name is required');
      }
      
      if (!formData.poster.trim()) {
        throw new Error('Poster URL is required');
      }
      
      // Prepare movie data for API
      const movieData = {
        name: formData.name.trim(),
        poster: formData.poster.trim(),
        release_date: formData.releaseDate,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        genre: formData.genre.trim(),
        playtime: formData.playtime.trim(),
        tmdb_id: formData.tmdbId || null,
        description: formData.description.trim(),
        servers: formData.servers
          .filter(server => server.name && server.url)
          .map(server => ({
            server_name: server.name.trim(),
            server_url: server.url.trim()
          }))
      };

      console.log('Submitting movie data:', movieData);

      const response = await movieAPI.addMovie(movieData);
      
      if (response.data.success) {
        setSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            name: '',
            poster: '',
            releaseDate: '',
            rating: '',
            genre: '',
            playtime: '',
            tmdbId: '',
            description: '',
            servers: [
              { name: 'UpCloud', url: '' },
              { name: 'MegaCloud', url: '' },
              { name: 'StreamSB', url: '' }
            ]
          });
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      
      let errorMessage = 'Error adding movie: ';
      
      if (error.message.includes('Backend server is not running')) {
        errorMessage = 'Backend server is not running. Please run: npm run dev';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Add New Movie</h1>
        <p className="text-gray-400 mt-1">Add a new movie to the platform</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400">Movie added successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">Movie Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TMDB Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Movie (TMDB Auto-fill)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type movie name to search TMDB..."
                  onChange={(e) => {
                    const query = e.target.value;
                    if (query.length > 2) {
                      searchTMDB(query);
                    } else {
                      setShowTmdbResults(false);
                    }
                  }}
                  className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                
                {tmdbLoading && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              
              {/* TMDB Search Results */}
              {showTmdbResults && tmdbSearchResults.length > 0 && (
                <div className="mt-2 bg-dark border border-dark-lighter rounded-lg max-h-60 overflow-y-auto relative">
                  <div className="flex items-center justify-between p-2 border-b border-dark-lighter">
                    <span className="text-gray-300 text-sm">TMDB Search Results</span>
                    <button
                      type="button"
                      onClick={() => setShowTmdbResults(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {tmdbSearchResults.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => fillFromTMDB(movie)}
                      className="flex items-center p-3 hover:bg-dark-lighter cursor-pointer border-b border-dark-lighter last:border-b-0"
                    >
                      <img
                        src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '/placeholder-movie.jpg'}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.src = '/placeholder-movie.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{movie.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • 
                          Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs line-clamp-2">{movie.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showTmdbResults && tmdbSearchResults.length === 0 && !tmdbLoading && (
                <div className="mt-2 bg-dark border border-dark-lighter rounded-lg p-4 text-center">
                  <p className="text-gray-400">No movies found. Try a different search term.</p>
                </div>
              )}
            </div>

            {/* TMDB ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                TMDB ID (Optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="tmdbId"
                  value={formData.tmdbId}
                  onChange={handleChange}
                  className="flex-1 bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  placeholder="Enter TMDB ID to auto-fill movie details"
                />
                <button
                  type="button"
                  onClick={fetchFromTMDB}
                  disabled={!formData.tmdbId || tmdbLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {tmdbLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Fetch</span>
                </button>
              </div>
            </div>

            {/* Movie Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Movie Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Enter movie name"
              />
            </div>

            {/* Poster URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poster Image URL *
              </label>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Date *
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                min="0"
                max="10"
                step="0.1"
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="8.5"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre *
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Action, Drama, Thriller"
              />
            </div>

            {/* Playtime */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playtime *
              </label>
              <input
                type="text"
                name="playtime"
                value={formData.playtime}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="120 min"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                placeholder="Enter movie description..."
              />
            </div>
          </div>
        </div>
        {/* Server URLs */}
        <div className="bg-dark-light rounded-lg p-6 border border-dark-lighter">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Server URLs</h2>
            <button
              type="button"
              onClick={addServer}
              className="bg-primary hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Server</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.servers.map((server, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={server.name}
                    onChange={(e) => handleServerChange(index, 'name', e.target.value)}
                    placeholder="Server Name (e.g., UpCloud)"
                    className="bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="url"
                    value={server.url}
                    onChange={(e) => handleServerChange(index, 'url', e.target.value)}
                    placeholder="https://example.com/embed/movie"
                    className="bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                </div>
                {formData.servers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServer(index)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-dark-lighter text-gray-300 rounded-lg hover:bg-dark-lighter transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding Movie...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Add Movie</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;