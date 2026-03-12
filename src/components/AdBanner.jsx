import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { adsAPI } from '../services/api';

const AdBanner = ({ position = 'top', className = '' }) => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [adType, setAdType] = useState('banner'); // 'banner' or 'code'

  useEffect(() => {
    fetchAds();
  }, [position]);

  const fetchAds = async () => {
    try {
      const response = await adsAPI.getAll();
      const filteredAds = response.data.data.filter(ad => ad.position === position && ad.enabled);
      setAds(filteredAds);
      
      if (filteredAds.length > 0) {
        setCurrentAd(filteredAds[0]);
        // Determine ad type based on content
        if (filteredAds[0].ad_code && filteredAds[0].ad_code.trim()) {
          setAdType('code');
        } else {
          setAdType('banner');
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      // Fallback to Adstera ads
      setAdsteraAds();
    }
  };

  const setAdsteraAds = () => {
    const adsteraAds = {
      top: {
        id: 'adstera-top',
        name: 'Adstera Top Banner',
        ad_code: `
          <script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-key-here',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-key-here/invoke.js"></scr' + 'ipt>');
          </script>
        `,
        position: 'top',
        enabled: true
      },
      sidebar: {
        id: 'adstera-sidebar',
        name: 'Adstera Sidebar',
        ad_code: `
          <script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-sidebar-key-here',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-sidebar-key-here/invoke.js"></scr' + 'ipt>');
          </script>
        `,
        position: 'sidebar',
        enabled: true
      },
      bottom: {
        id: 'adstera-bottom',
        name: 'Adstera Bottom Banner',
        ad_code: `
          <script type="text/javascript">
            atOptions = {
              'key' : 'your-adstera-bottom-key-here',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.topcreativeformat.com/your-adstera-bottom-key-here/invoke.js"></scr' + 'ipt>');
          </script>
        `,
        position: 'bottom',
        enabled: true
      }
    };

    if (adsteraAds[position]) {
      setCurrentAd(adsteraAds[position]);
      setAdType('code');
    }
  };

  const handleAdClick = () => {
    if (currentAd?.redirect_link) {
      // Track ad click
      trackAdClick();
      window.open(currentAd.redirect_link, '_blank');
    }
  };

  const trackAdClick = async () => {
    try {
      if (currentAd?.id && typeof currentAd.id === 'number') {
        await adsAPI.trackClick(currentAd.id);
      }
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  const trackAdImpression = async () => {
    try {
      if (currentAd?.id && typeof currentAd.id === 'number') {
        await adsAPI.trackImpression(currentAd.id);
      }
    } catch (error) {
      console.error('Error tracking ad impression:', error);
    }
  };

  useEffect(() => {
    if (currentAd && isVisible) {
      trackAdImpression();
    }
  }, [currentAd, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentAd || !isVisible) {
    return null;
  }

  const getAdStyles = () => {
    switch (position) {
      case 'top':
        return 'w-full max-w-4xl mx-auto min-h-[90px]';
      case 'sidebar':
        return 'w-full max-w-xs min-h-[250px]';
      case 'bottom':
        return 'w-full max-w-4xl mx-auto min-h-[90px]';
      default:
        return 'w-full min-h-[90px]';
    }
  };

  return (
    <div className={`relative ${getAdStyles()} ${className}`}>
      <div className="relative bg-dark-light rounded-lg overflow-hidden border border-dark-lighter group">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad content */}
        {adType === 'code' ? (
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            dangerouslySetInnerHTML={{ __html: currentAd.ad_code }}
          />
        ) : (
          <div
            onClick={handleAdClick}
            className="w-full h-full cursor-pointer overflow-hidden"
          >
            <img
              src={currentAd.image_url}
              alt={currentAd.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onLoad={trackAdImpression}
            />
          </div>
        )}

        {/* Ad label */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Ad
        </div>
      </div>
    </div>
  );
};

export default AdBanner;