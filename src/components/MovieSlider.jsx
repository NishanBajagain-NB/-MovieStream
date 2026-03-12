import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Star, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MovieSlider = ({ movies = [] }) => {
  if (!movies.length) {
    return (
      <div className="relative h-[70vh] bg-dark-light rounded-lg animate-pulse">
        <div className="absolute inset-0 skeleton"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-[70vh] rounded-lg overflow-hidden"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={movie.poster || '/placeholder-movie.jpg'}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {movie.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      {movie.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">{movie.rating}</span>
                        </div>
                      )}
                      
                      {movie.release_date && (
                        <span className="text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      )}
                      
                      {movie.playtime && (
                        <span className="text-gray-300">{movie.playtime}</span>
                      )}
                      
                      {movie.genre && (
                        <span className="bg-primary px-3 py-1 rounded text-white text-sm font-medium">
                          {movie.genre}
                        </span>
                      )}
                    </div>

                    {movie.description && (
                      <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                        {movie.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-300"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>Play Now</span>
                      </Link>
                      
                      <Link
                        to={`/movie/${movie.id}`}
                        className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-300 backdrop-blur-sm"
                      >
                        <Info className="w-5 h-5" />
                        <span>More Info</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {/* Pagination bullets will be inserted here by Swiper */}
      </div>

      <style jsx>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: #e50914;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default MovieSlider;