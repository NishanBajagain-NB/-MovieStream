import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-dark-light rounded-2xl p-12 border border-dark-lighter">
            {/* 404 Animation */}
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-bold text-primary mb-4 animate-pulse">
                404
              </div>
              <div className="text-6xl mb-6">🎬</div>
            </div>
            
            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              The page you're looking for seems to have vanished into the digital void. 
              It might have been moved, deleted, or you may have entered the wrong URL.
            </p>
            
            {/* Suggestions */}
            <div className="bg-dark rounded-lg p-6 mb-8 border border-dark-lighter">
              <h2 className="text-xl font-semibold text-white mb-4">What can you do?</h2>
              <ul className="text-gray-300 space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <span className="text-primary">•</span>
                  <span>Check the URL for any typos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-primary">•</span>
                  <span>Go back to the previous page</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-primary">•</span>
                  <span>Search for movies using our search feature</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-primary">•</span>
                  <span>Visit our homepage to browse movies</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Homepage</span>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="bg-dark-lighter hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 border border-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>
            
            {/* Search Suggestion */}
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Search className="w-5 h-5 text-primary" />
                <span>Try searching for your favorite movies using the search bar above</span>
              </div>
            </div>
            
            {/* Fun Message */}
            <div className="mt-6 text-gray-500 text-sm">
              <p>Don't worry, even the best directors have scenes that end up on the cutting room floor! 🎭</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;