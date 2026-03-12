import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import { movieAPI } from '../services/api';

const MoviePlayerPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState('server1');
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      
      // Call actual API
      const response = await movieAPI.getMovie(id);
      const movieData = response.data.data;
      
      // Transform the movie data to include servers in the expected format
      const transformedMovie = {
        ...movieData,
        servers: movieData.servers ? movieData.servers.reduce((acc, server, index) => {
          acc[`server${index + 1}`] = {
            name: server.server_name,
            url: server.server_url
          };
          return acc;
        }, {}) : {
          server1: {
            name: 'UpCloud',
            url: 'https://www.youtube.com/embed/EXeTwQWrcwY'
          }
        }
      };
      
      setMovie(transformedMovie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      
      // Fallback to mock data if API fails
      const mockMovie = {
        id: id,
        name: 'The Dark Knight',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        release_date: '2008-07-18',
        rating: '9.0',
        genre: 'Action, Crime, Drama',
        playtime: '152 min',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the city streets.',
        servers: {
          server1: {
            name: 'UpCloud',
            url: 'https://www.youtube.com/embed/EXeTwQWrcwY'
          },
          server2: {
            name: 'MegaCloud',
            url: 'https://www.youtube.com/embed/EXeTwQWrcwY'
          },
          server3: {
            name: 'StreamSB',
            url: 'https://www.youtube.com/embed/EXeTwQWrcwY'
          }
        }
      };
      
      setMovie(mockMovie);
    } finally {
      setLoading(false);
    }
  };

  const handleServerChange = (serverKey) => {
    setPlayerLoading(true);
    setSelectedServer(serverKey);
    
    // Simulate loading delay
    setTimeout(() => {
      setPlayerLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-dark-light rounded w-32 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="aspect-video bg-dark-light rounded-lg mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-dark-light rounded w-3/4"></div>
                    <div className="h-4 bg-dark-light rounded w-full"></div>
                    <div className="h-4 bg-dark-light rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-dark-light rounded-lg"></div>
                  <div className="h-32 bg-dark-light rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="pt-20 pb-20">
        {/* Top Ad Banner */}
        <div className="px-4 mb-6">
          <AdBanner position="top" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Movies</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="bg-dark-light rounded-lg overflow-hidden mb-6">
                <div className="aspect-video relative">
                  {playerLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-light">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-white">Loading player...</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={movie.servers[selectedServer]?.url}
                      title={movie.name}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  )}
                </div>
              </div>

              {/* Server Selection */}
              <div className="bg-dark-light rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Server</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(movie.servers).map(([key, server]) => (
                    <button
                      key={key}
                      onClick={() => handleServerChange(key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedServer === key
                          ? 'bg-primary text-white'
                          : 'bg-dark-lighter text-gray-300 hover:bg-dark-lighter/80'
                      }`}
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      {server.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Movie Details */}
              <div className="bg-dark-light rounded-lg p-6">
                <h1 className="text-3xl font-bold text-white mb-4">{movie.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{movie.rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>{movie.playtime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.split(', ').map((genre, index) => (
                      <span
                        key={index}
                        className="bg-primary px-3 py-1 rounded text-white text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Poster */}
              <div className="bg-dark-light rounded-lg p-6">
                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-full rounded-lg mb-4"
                />
                
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Release Date:</span>
                    <p className="text-white font-medium">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Duration:</span>
                    <p className="text-white font-medium">{movie.playtime}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Genre:</span>
                    <p className="text-white font-medium">{movie.genre}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 text-sm">Rating:</span>
                    <p className="text-white font-medium flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {movie.rating}/10
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Ad */}
              <AdBanner position="sidebar" />

              {/* Related Movies */}
              <div className="bg-dark-light rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">You May Also Like</h3>
                <div className="space-y-4">
                  {/* Mock related movies */}
                  {[
                    { id: '2', name: 'Inception', poster: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
                    { id: '3', name: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
                    { id: '4', name: 'The Matrix', poster: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' }
                  ].map((relatedMovie) => (
                    <Link
                      key={relatedMovie.id}
                      to={`/movie/${relatedMovie.id}`}
                      className="flex items-center space-x-3 hover:bg-dark-lighter p-2 rounded transition-colors"
                    >
                      <img
                        src={relatedMovie.poster}
                        alt={relatedMovie.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="text-white font-medium text-sm">{relatedMovie.name}</h4>
                        <p className="text-gray-400 text-xs">Action</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-12 px-4">
          <AdBanner position="bottom" />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MoviePlayerPage;