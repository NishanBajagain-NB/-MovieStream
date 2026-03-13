import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import ConnectionTest from '../components/ConnectionTest';
import { movieAPI } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const moviesPerPage = 20;

  useEffect(() => {
    fetchMovies();
    
    // Show debug panel if there are connection issues
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setShowDebug(true);
    }
  }, []);

  useEffect(() => {
    // Filter movies based on search query
    if (searchQuery.trim()) {
      // Use API search when there's a search query
      searchMoviesAPI(searchQuery);
    } else {
      setFilteredMovies(allMovies);
    }
    setCurrentPage(1); // Reset to first page when searching
    setShowAllMovies(false); // Reset view more state when searching
  }, [searchQuery, allMovies]);

  const searchMoviesAPI = async (query) => {
    try {
      const response = await movieAPI.searchMovies(query);
      const searchResults = response.data.data || [];
      setFilteredMovies(searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      // Fallback to local filtering
      const filtered = allMovies.filter(movie =>
        movie.name.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      // Call actual API for all movies and newly added
      const [allMoviesResponse, newlyAddedResponse] = await Promise.all([
        movieAPI.getAllMovies(),
        movieAPI.getNewlyAdded(4)
      ]);
      
      const movies = allMoviesResponse.data.data || [];
      const newMovies = newlyAddedResponse.data.data || [];
      
      setNewlyAddedMovies(newMovies);
      setAllMovies(movies);
      setFilteredMovies(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      
      // Fallback to mock data if API fails
      const mockMovies = [
        {
          id: '1',
          name: 'The Dark Knight',
          poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          release_date: '2008-07-18',
          rating: '9.0',
          genre: 'Action',
          playtime: '152 min',
          description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
        },
        {
          id: '2',
          name: 'Inception',
          poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          release_date: '2010-07-16',
          rating: '8.8',
          genre: 'Sci-Fi',
          playtime: '148 min',
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
        },
        {
          id: '3',
          name: 'Interstellar',
          poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          release_date: '2014-11-07',
          rating: '8.6',
          genre: 'Sci-Fi',
          playtime: '169 min',
          description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
        },
        {
          id: '4',
          name: 'The Matrix',
          poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
          release_date: '1999-03-31',
          rating: '8.7',
          genre: 'Action',
          playtime: '136 min',
          description: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.'
        },
        {
          id: '5',
          name: 'Pulp Fiction',
          poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
          release_date: '1994-10-14',
          rating: '8.9',
          genre: 'Crime',
          playtime: '154 min',
          description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
        },
        {
          id: '6',
          name: 'The Godfather',
          poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
          release_date: '1972-03-24',
          rating: '9.2',
          genre: 'Crime',
          playtime: '175 min',
          description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
        }
      ];

      setNewlyAddedMovies(mockMovies.slice(0, 4));
      setAllMovies(mockMovies);
      setFilteredMovies(mockMovies);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getCurrentPageMovies = () => {
    if (searchQuery) {
      // For search results, show all results with pagination
      const startIndex = (currentPage - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      return filteredMovies.slice(startIndex, endIndex);
    } else {
      // For all movies, show first 20 or all if "View More" is clicked
      return showAllMovies ? filteredMovies : filteredMovies.slice(0, moviesPerPage);
    }
  };

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMore = () => {
    setShowAllMovies(true);
  };

  const handleViewLess = () => {
    setShowAllMovies(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar onSearch={handleSearch} />
      
      {/* Top Ad Banner */}
      <div className="pt-20 pb-4">
        <AdBanner position="top" className="px-4" />
      </div>

      <main className="pb-20">
        {/* Debug Panel */}
        {showDebug && (
          <section className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="max-w-7xl mx-auto">
              <ConnectionTest />
            </div>
          </section>
        )}
        
        {/* Hero Section - Newly Added Movies Slider - Only show if no search */}
        {!searchQuery && (
          <section className="px-4 sm:px-6 lg:px-8 mb-12">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="h-[70vh] bg-dark-light rounded-lg animate-pulse skeleton"></div>
              ) : (
                <MovieSlider movies={newlyAddedMovies} />
              )}
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Movies Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Movies'}
                  </h2>
                  <div className="text-gray-400">
                    {filteredMovies.length} movies {searchQuery ? 'found' : 'available'}
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="aspect-[2/3] bg-dark-light rounded-lg animate-pulse skeleton"></div>
                    ))}
                  </div>
                ) : filteredMovies.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                    <p className="text-gray-400">
                      {searchQuery 
                        ? `No movies match your search for "${searchQuery}"`
                        : 'No movies available at the moment'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                      {getCurrentPageMovies().map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>

                    {/* View More Button for All Movies or Pagination for Search Results */}
                    {searchQuery ? (
                      // Pagination for search results
                      totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-dark-light text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-lighter transition-colors"
                          >
                            Previous
                          </button>
                          
                          {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                            let page;
                            if (totalPages <= 5) {
                              page = index + 1;
                            } else if (currentPage <= 3) {
                              page = index + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + index;
                            } else {
                              page = currentPage - 2 + index;
                            }
                            
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'bg-dark-light text-white hover:bg-dark-lighter'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-dark-light text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-lighter transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      )
                    ) : (
                      // View More/View Less buttons for all movies
                      filteredMovies.length > moviesPerPage && (
                        <div className="flex justify-center">
                          {!showAllMovies ? (
                            <button
                              onClick={handleViewMore}
                              className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <span>View More Movies</span>
                              <span className="text-sm opacity-75">({filteredMovies.length - moviesPerPage} more)</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleViewLess}
                              className="bg-dark-light hover:bg-dark-lighter text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                              View Less
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </>
                )}
              </section>
            </div>

            {/* Sidebar - Only show if no search */}
            {!searchQuery && (
              <div className="lg:w-80">
                <div className="sticky top-24 space-y-6">
                  {/* Sidebar Ad */}
                  <AdBanner position="sidebar" />
                  
                  {/* Popular Movies */}
                  <div className="bg-dark-light rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Popular This Week</h3>
                    <div className="space-y-4">
                      {allMovies.slice(0, 5).map((movie, index) => (
                        <div 
                          key={movie.id} 
                          className="flex items-center space-x-3 cursor-pointer hover:bg-dark-lighter rounded-lg p-2 transition-colors group"
                          onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                          <div className="text-primary font-bold text-lg w-6">
                            {index + 1}
                          </div>
                          <img
                            src={movie.poster}
                            alt={movie.name}
                            className="w-12 h-16 object-cover rounded group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = '/placeholder-movie.jpg';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {movie.name}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              {movie.genre} • ⭐ {movie.rating}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(movie.release_date).getFullYear()}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-12 px-4">
          <AdBanner position="bottom" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;