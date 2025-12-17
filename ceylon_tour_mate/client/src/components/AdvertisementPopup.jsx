import { useState, useEffect } from 'react';
import axios from 'axios';

function AdvertisementPopup() {
  const [advertisement, setAdvertisement] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAds, setAllAds] = useState([]);

  useEffect(() => {
    fetchActiveAdvertisements();
  }, []);

  useEffect(() => {
    // Check if user has closed popup in this session
    const popupClosed = sessionStorage.getItem('adPopupClosed');
    
    if (advertisement && !popupClosed) {
      // Show popup after 3 seconds delay
      const timer = setTimeout(() => {
        setShowPopup(true);
        trackView(advertisement.id);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [advertisement]);

  // Auto-rotate ads if multiple exist
  useEffect(() => {
    if (allAds.length > 1 && showPopup) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          const newIndex = (prev + 1) % allAds.length;
          setAdvertisement(allAds[newIndex]);
          trackView(allAds[newIndex].id);
          return newIndex;
        });
      }, 10000); // Change ad every 10 seconds

      return () => clearInterval(timer);
    }
  }, [allAds, showPopup]);

  const fetchActiveAdvertisements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/advertisements/active');
      if (response.data && response.data.length > 0) {
        setAllAds(response.data);
        setAdvertisement(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const trackView = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/advertisements/${id}/view`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackClick = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/advertisements/${id}/click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    // Remember that user closed popup for this session
    sessionStorage.setItem('adPopupClosed', 'true');
  };

  const handleLinkClick = () => {
    if (advertisement?.linkUrl) {
      trackClick(advertisement.id);
      window.open(advertisement.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!showPopup || !advertisement) {
    return null;
  }

  return (
    <>
      {/* Backdrop/Overlay */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 pointer-events-none">
        <div 
          className="overflow-hidden relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex absolute top-4 right-4 z-10 justify-center items-center w-10 h-10 text-white rounded-full backdrop-blur-sm transition-all bg-black/50 hover:bg-black/70 hover:scale-110"
            aria-label="Close advertisement"
          >
            <i className="text-xl fas fa-times"></i>
          </button>

          {/* Ad Counter (if multiple ads) */}
          {allAds.length > 1 && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 text-sm font-bold text-white rounded-full backdrop-blur-sm bg-black/50">
              {currentIndex + 1} / {allAds.length}
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            {advertisement.imageUrl && (
              <div className="relative h-64 md:w-1/2 md:h-auto">
                <img
                  src={`http://localhost:5000${advertisement.imageUrl}`}
                  alt={advertisement.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/50 md:bg-gradient-to-r md:from-transparent md:to-black/20" />
              </div>
            )}

            {/* Content Section */}
            <div className={`flex flex-col justify-center p-8 md:p-12 ${advertisement.imageUrl ? 'md:w-1/2' : 'w-full text-center'}`}>
              {/* Special Offer Badge */}
              <div className="inline-block mb-4">
                <span className="px-4 py-2 text-sm font-bold text-orange-600 bg-orange-100 rounded-full">
                  <i className="mr-2 fas fa-star"></i>
                  Special Offer
                </span>
              </div>

              {/* Title */}
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {advertisement.title}
              </h2>

              {/* Description */}
              {advertisement.description && (
                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  {advertisement.description}
                </p>
              )}

              {/* Duration Info */}
              <div className="flex gap-2 items-center mb-6 text-sm text-gray-500">
                <i className="fas fa-clock"></i>
                <span>
                  Valid till {new Date(advertisement.endDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {advertisement.linkUrl && (
                  <button
                    onClick={handleLinkClick}
                    className="flex gap-2 justify-center items-center px-8 py-4 font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <span>{advertisement.linkText || 'Learn More'}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                )}
                
                <button
                  onClick={handleClose}
                  className="px-8 py-4 font-semibold text-gray-700 bg-gray-100 rounded-xl transition-all hover:bg-gray-200"
                >
                  Maybe Later
                </button>
              </div>

              {/* Don't show again link */}
              <button
                onClick={handleClose}
                className="mt-4 text-sm text-gray-400 underline transition hover:text-gray-600"
              >
                Don't show this again
              </button>
            </div>
          </div>

          {/* Navigation Dots (if multiple ads) */}
          {allAds.length > 1 && (
            <div className="flex absolute bottom-4 left-1/2 gap-2 justify-center -translate-x-1/2">
              {allAds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAdvertisement(allAds[index]);
                    trackView(allAds[index].id);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-orange-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to advertisement ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

export default AdvertisementPopup;