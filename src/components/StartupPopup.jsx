import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const StartupPopup = ({ onClose }) => {
  const [popupData, setPopupData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPopupData();
  }, []);

  useEffect(() => {
    if (popupData) {
      // Show popup with animation delay
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [popupData]);

  const fetchPopupData = async () => {
    try {
      // Mock API call - replace with actual API
      const mockPopupData = {
        enabled: true,
        title: 'Welcome to MovieStream!',
        description: 'Join our community and stay updated with the latest movies and releases. Follow us on social media for exclusive content and updates.',
        discordLink: 'https://discord.gg/moviestream',
        facebookLink: 'https://facebook.com/moviestream',
        twitterLink: 'https://twitter.com/moviestream'
      };

      if (mockPopupData.enabled) {
        setPopupData(mockPopupData);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error fetching popup data:', error);
      onClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleSocialClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!popupData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div className={`relative glass border border-white/20 rounded-2xl p-8 max-w-md w-full transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-slow">
            <span className="text-white font-bold text-3xl">M</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-4 gradient-text">
            {popupData.title}
          </h2>

          {/* Description */}
          <p className="text-gray-300 mb-8 leading-relaxed text-sm">
            {popupData.description}
          </p>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            
            <div className="flex justify-center space-x-3">
              {popupData.discordLink && (
                <button
                  onClick={() => handleSocialClick(popupData.discordLink)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="text-sm">Discord</span>
                </button>
              )}

              {popupData.facebookLink && (
                <button
                  onClick={() => handleSocialClick(popupData.facebookLink)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Facebook</span>
                </button>
              )}

              {popupData.twitterLink && (
                <button
                  onClick={() => handleSocialClick(popupData.twitterLink)}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-sm">Twitter</span>
                </button>
              )}
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleClose}
            className="mt-8 w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 btn-glow shadow-lg"
          >
            Continue to MovieStream
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupPopup;