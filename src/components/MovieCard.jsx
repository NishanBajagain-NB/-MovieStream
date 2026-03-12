import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="movie-card card-hover bg-dark-light rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton rounded-lg"></div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 bg-dark-lighter flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-dark-lighter rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          ) : (
            <img
              src={movie.poster || '/placeholder-movie.jpg'}
              alt={movie.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-primary rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300 btn-glow shadow-lg">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>

          {/* Rating Badge */}
          {movie.rating && (
            <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 flex items-center space-x-1 opacity-90">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white font-medium">{movie.rating}</span>
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-3 left-3 bg-primary/90 rounded px-2 py-1">
            <span className="text-xs text-white font-bold">HD</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4 bg-gradient-to-b from-dark-light to-dark">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {movie.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="font-medium">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
            
            {movie.playtime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{movie.playtime}</span>
              </div>
            )}
          </div>

          {movie.genre && (
            <div className="mt-2">
              <span className="inline-block bg-dark-lighter text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-600">
                {movie.genre.split(',')[0].trim()}
              </span>
            </div>
          )}

          {/* Progress Bar (Mock) */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full bg-dark-lighter rounded-full h-1">
              <div className="bg-primary h-1 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;