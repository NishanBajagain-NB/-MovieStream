import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAllMovies();
      setMovies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      try {
        const response = await movieAPI.deleteMovie(id);
        if (response.data.success) {
          setMovies(movies.filter(movie => movie.id !== id));
          alert('Movie deleted successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to delete movie');
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        let errorMessage = 'Error deleting movie: ';
        
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
      }
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie({
      ...movie,
      release_date: movie.release_date ? movie.release_date.split('T')[0] : '',
      servers: Array.isArray(movie.servers) ? movie.servers : []
    });
    setShowEditForm(true);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!editingMovie.name?.trim()) {
        throw new Error('Movie name is required');
      }
      
      const movieData = {
        name: editingMovie.name.trim(),
        poster: editingMovie.poster?.trim() || '',
        release_date: editingMovie.release_date,
        rating: editingMovie.rating ? parseFloat(editingMovie.rating) : null,
        genre: editingMovie.genre?.trim() || '',
        playtime: editingMovie.playtime?.trim() || '',
        description: editingMovie.description?.trim() || '',
        servers: Array.isArray(editingMovie.servers) ? editingMovie.servers
          .filter(server => (server.server_name || server.name) && (server.server_url || server.url))
          .map(server => ({
            server_name: (server.server_name || server.name || '').trim(),
            server_url: (server.server_url || server.url || '').trim()
          })) : []
      };

      console.log('Updating movie with data:', movieData);

      const response = await movieAPI.updateMovie(editingMovie.id, movieData);
      
      if (response.data.success) {
        await fetchMovies(); // Refresh the list
        setShowEditForm(false);
        setEditingMovie(null);
        alert('Movie updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      
      let errorMessage = 'Error updating movie: ';
      
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
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Movies</h1>
          <p className="text-gray-400 mt-1">Edit and manage your movie collection ({movies.length} movies)</p>
        </div>
        <Link
          to="/admin/add-movie"
          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Movie</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-light border border-dark-lighter rounded-lg px-4 py-2 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Movies Table */}
      <div className="bg-dark-light rounded-lg border border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark border-b border-dark-lighter">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Movie</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Release Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Rating</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Duration</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Views</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-dark-lighter">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-dark rounded skeleton"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-dark rounded skeleton w-32"></div>
                          <div className="h-3 bg-dark rounded skeleton w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-12"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-12"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-dark rounded skeleton w-20"></div></td>
                  </tr>
                ))
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg mb-2">No movies found</p>
                      <p className="text-sm">
                        {searchTerm ? `No movies match "${searchTerm}"` : 'Start by adding your first movie'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="border-b border-dark-lighter hover:bg-dark/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={movie.poster}
                          alt={movie.name}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x300/333/fff?text=No+Image';
                          }}
                        />
                        <div>
                          <h3 className="text-white font-medium">{movie.name}</h3>
                          <p className="text-gray-400 text-sm">ID: {movie.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-300">{movie.rating || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-300">{movie.playtime || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-300">{movie.views?.toLocaleString() || 0}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/movie/${movie.id}`}
                          target="_blank"
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Movie"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Edit Movie"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Movie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Movie Modal */}
      {showEditForm && editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-light rounded-lg p-6 w-full max-w-2xl border border-dark-lighter max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Edit Movie</h2>
            
            <form onSubmit={handleUpdateMovie} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Movie Name</label>
                  <input
                    type="text"
                    value={editingMovie.name}
                    onChange={(e) => setEditingMovie({...editingMovie, name: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingMovie.rating}
                    onChange={(e) => setEditingMovie({...editingMovie, rating: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                  <input
                    type="date"
                    value={editingMovie.release_date}
                    onChange={(e) => setEditingMovie({...editingMovie, release_date: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Playtime</label>
                  <input
                    type="text"
                    value={editingMovie.playtime}
                    onChange={(e) => setEditingMovie({...editingMovie, playtime: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    placeholder="120 min"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
                  <input
                    type="url"
                    value={editingMovie.poster}
                    onChange={(e) => setEditingMovie({...editingMovie, poster: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <input
                    type="text"
                    value={editingMovie.genre}
                    onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    placeholder="Action, Drama, Thriller"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={editingMovie.description || ''}
                    onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})}
                    className="w-full bg-dark border border-dark-lighter rounded-lg px-4 py-2 text-white"
                    rows={3}
                  />
                </div>
              </div>

              {/* Server URLs */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Server URLs</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newServers = [...(editingMovie.servers || []), { server_name: '', server_url: '' }];
                      setEditingMovie({...editingMovie, servers: newServers});
                    }}
                    className="bg-primary hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Server</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(editingMovie.servers || []).map((server, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={server.server_name || server.name || ''}
                          onChange={(e) => {
                            const newServers = [...editingMovie.servers];
                            newServers[index] = { ...newServers[index], server_name: e.target.value };
                            setEditingMovie({...editingMovie, servers: newServers});
                          }}
                          placeholder="Server Name (e.g., UpCloud)"
                          className="bg-dark border border-dark-lighter rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                        />
                        <input
                          type="url"
                          value={server.server_url || server.url || ''}
                          onChange={(e) => {
                            const newServers = [...editingMovie.servers];
                            newServers[index] = { ...newServers[index], server_url: e.target.value };
                            setEditingMovie({...editingMovie, servers: newServers});
                          }}
                          placeholder="https://example.com/embed/movie"
                          className="bg-dark border border-dark-lighter rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                        />
                      </div>
                      {editingMovie.servers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newServers = editingMovie.servers.filter((_, i) => i !== index);
                            setEditingMovie({...editingMovie, servers: newServers});
                          }}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {(!editingMovie.servers || editingMovie.servers.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-gray-400 mb-2">No servers added yet</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMovie({...editingMovie, servers: [{ server_name: 'UpCloud', server_url: '' }]});
                        }}
                        className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Add First Server
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingMovie(null);
                  }}
                  className="px-4 py-2 text-gray-300 border border-dark-lighter rounded-lg hover:bg-dark-lighter"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Update Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;