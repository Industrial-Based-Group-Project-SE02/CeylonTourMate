import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdvertisementPopup from './AdvertisementPopup';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState('6Lw2SdcT0To');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const destinations = [
    {
      image: 'sigiriya.jpg',
      title: 'Sigiriya Rock Fortress',
      description: 'Ancient rock fortress with stunning frescoes and panoramic views',
      tags: ['Cultural', 'Historical']
    },
    {
      image: 'ella.jpg',
      title: 'Ella & Tea Country',
      description: 'Mountain views, waterfalls, and scenic train rides through tea plantations',
      tags: ['Nature', 'Adventure']
    },
    {
      image: 'galle.jpg',
      title: 'Galle Fort',
      description: 'Dutch colonial architecture, boutique shops, and sunset views',
      tags: ['Coastal', 'Historical']
    },
    {
      image: 'yala.jpg',
      title: 'Yala National Park',
      description: 'Spot leopards, elephants, and exotic birds in Sri Lanka\'s premier wildlife sanctuary',
      tags: ['Wildlife', 'Safari']
    },
    {
      image: 'mirissa.jpg',
      title: 'Mirissa Beach',
      description: 'Golden sands, palm trees, and the best whale watching in Sri Lanka',
      tags: ['Beach', 'Whale Watching']
    },
    {
      image: 'hikkaduwa.jpg',
      title: 'Hikkaduwa Corals',
      description: 'Famous for surfing, coral reefs, and vibrant nightlife on the southern coast',
      tags: ['Beach', 'Surfing']
    }
  ];

  const experiences = [
    {
      icon: 'fa-train',
      gradient: 'from-orange-500 to-yellow-500',
      title: 'Scenic Train Rides',
      description: 'Journey through misty mountains and tea plantations on one of the world\'s most beautiful train routes.'
    },
    {
      icon: 'fa-elephant',
      gradient: 'from-green-500 to-teal-500',
      title: 'Elephant Safaris',
      description: 'Witness majestic elephants in their natural habitat at ethical sanctuaries and national parks.'
    },
    {
      icon: 'fa-utensils',
      gradient: 'from-blue-500 to-purple-500',
      title: 'Cooking Classes',
      description: 'Learn to prepare authentic Sri Lankan cuisine with local chefs using traditional methods.'
    },
    {
      icon: 'fa-whale',
      gradient: 'from-red-500 to-pink-500',
      title: 'Whale Watching',
      description: 'Spot blue whales, dolphins, and other marine life on guided tours from Mirissa or Kalpitiya.'
    }
  ];

  // State for packages from database
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Fetch packages from database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await fetch('http://localhost:5000/api/packages/active-packages');
        const data = await response.json();
        
        console.log('Fetched packages:', data); // Debug log
        
        // The API returns an array directly when successful
        let packagesData = Array.isArray(data) ? data : (data.data || []);
        
        if (packagesData.length > 0) {
          // Transform database packages to match UI format
          const transformedPackages = packagesData.map(pkg => ({
            id: pkg.id,
            name: pkg.package_name,
            tier: pkg.category || 'silver',
            duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`,
            priceRange: `$${pkg.min_price} - $${pkg.max_price}`,
            price: `$${pkg.min_price}`,
            image: pkg.featured_image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviews: Math.floor(Math.random() * 300) + 100,
            featured: pkg.category === 'gold',
            tagline: pkg.category === 'gold' ? 'Premium Experience' : 
                     pkg.category === 'silver' ? 'Comfort Experience' : 
                     pkg.category === 'platinum' ? 'Essential Experience' : 'Custom Experience',
            gradient: pkg.category === 'gold' ? 'from-yellow-400 via-yellow-500 to-orange-500' :
                     pkg.category === 'silver' ? 'from-gray-300 via-gray-400 to-gray-500' :
                     pkg.category === 'platinum' ? 'from-orange-600 via-orange-700 to-orange-800' :
                     'from-purple-500 via-pink-500 to-red-500',
            highlights: pkg.inclusions ? pkg.inclusions.split('\n').filter(h => h.trim()).map(h => h.replace('•', '').trim()) : [],
            includes: [`${pkg.hotel_stars}-Star Hotels`, `${pkg.duration_days} Days`, `${pkg.min_travelers}-${pkg.max_travelers} Travelers`]
          }));
          
          console.log('Transformed packages:', transformedPackages); // Debug log
          setPackages(transformedPackages);
        }
        setLoadingPackages(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  // Fetch real YouTube videos about Sri Lanka
  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        setLoading(true);
        const API_KEY = 'AIzaSyD5fTfsMnJ7Gz5d-UcnqzDq3JOD0Th9Z4M'; // Replace with your YouTube API key
        const searchQuery = 'Sri Lanka travel 4K';
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=8&key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        
        const videoDetails = data.items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          subtitle: item.snippet.channelTitle,
          image: item.snippet.thumbnails.medium.url,
          duration: '5:00',
          views: 'N/A'
        }));
        
        setVideos(videoDetails);
        if (videoDetails.length > 0) {
          setSelectedVideo(videoDetails[0].videoId);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        // Fallback to default videos if API fails
        setVideos([
          {
            image: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            title: 'Cultural Heritage',
            subtitle: 'Ancient cities and temples',
            videoId: '6Lw2SdcT0To',
            duration: '4:32',
            views: '24K'
          },
          {
            image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3e2ede5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            title: 'Tea Country',
            subtitle: 'Scenic train journeys',
            videoId: 'TYkQrjcrSzQ',
            duration: '3:15',
            views: '18K'
          },
          {
            image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            title: 'Wildlife Safari',
            subtitle: 'National parks & elephants',
            videoId: 'T_mhxIr9fZE',
            duration: '5:20',
            views: '32K'
          },
          {
            image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            title: 'Tropical Beaches',
            subtitle: 'Coastal paradise',
            videoId: '5biJsewGHZY',
            duration: '4:05',
            views: '28K'
          }
        ]);
        setSelectedVideo('6Lw2SdcT0To');
        setLoading(false);
      }
    };

    fetchYouTubeVideos();
  }, []);

  // Handle Book Now click
  const handleBookNow = (packageId) => {
    if (user) {
      // If user is logged in, go to booking form
      navigate('/tourist/bookingForm', { state: { packageId } });
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      <AdvertisementPopup />
      {/* Hero Section with Video Background */}
     <section className="overflow-hidden relative h-screen">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="object-cover w-full h-full">
            <source src="/vedio1.mp4" type="video/mp4" />
            <img
              src="https://images.unsplash.com/photo-1591273531346-bd946dab7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Sri Lanka Beach"
              className="object-cover w-full h-full"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        <div className="flex relative z-10 items-center h-full">
          <div className="container px-4 mx-auto md:px-12">
            <div className="max-w-3xl animate-fadeInUp">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 text-sm font-medium text-orange-300 bg-gradient-to-r rounded-full border backdrop-blur-sm from-orange-500/20 to-orange-500/10 border-orange-500/30">
                  <i className="mr-2 fas fa-star"></i>Top Rated Destination 2024
                </span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl" style={{fontFamily: 'Playfair Display, serif'}}>
                Discover <span className="text-orange-400">Sri Lanka</span>
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-gray-200" style={{textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'}}>
                A tropical paradise with ancient cities, lush tea plantations, golden beaches, and exotic wildlife. 
                Experience the warmth of Sri Lankan hospitality.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                <button className="flex justify-center items-center px-8 py-4 text-lg font-bold text-white bg-orange-500 rounded-xl shadow-lg animate-pulse hover:bg-orange-600">
                  <i className="mr-3 fas fa-play-circle"></i> Watch Sri Lanka Experience
                </button>
                <button className="flex justify-center items-center px-8 py-4 text-lg font-bold text-white rounded-xl border backdrop-blur-sm transition-colors bg-white/20 hover:bg-white/30 border-white/30">
                  <i className="mr-3 fas fa-map-marked-alt"></i> Explore Destinations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-10 left-1/2 z-20 transform -translate-x-1/2">
          <a href="#advertisements" className="text-white animate-bounce">
            <i className="text-3xl fas fa-chevron-down"></i>
          </a>
        </div> */}
      </section>
       

      {/* Destinations Carousel */}
      <section id="destinations" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Must-Visit <span className="text-orange-400">Destinations</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              Explore the diverse beauty of Sri Lanka through its most iconic locations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="relative h-[500px] rounded-3xl overflow-hidden cursor-pointer group"
                onClick={() => alert(`Selected: ${dest.title}`)}
              >
                <img src={dest.image} alt={dest.title} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                <div className="absolute right-0 bottom-0 left-0 p-8 text-white transition-transform duration-300 transform group-hover:-translate-y-2">
                  <div className="flex gap-2 items-center mb-4">
                    {dest.tags.map((tag, i) => (
                      <span key={i} className="px-4 py-1 text-sm font-bold text-white bg-orange-500 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">{dest.title}</h3>
                  <p className="mb-4 text-gray-200">{dest.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="px-6 py-3 font-bold text-gray-900 bg-white rounded-full transition hover:bg-gray-100">
                      Explore <i className="ml-2 fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Experience Section */}
      <section id='experiences' className="relative py-20 bg-black">
        <div className="absolute inset-0 bg-fixed bg-center bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"}}></div>
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Experience Sri Lanka in <span className="text-orange-400">Motion</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              Watch our stunning video collection showcasing the beauty of Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden relative rounded-3xl shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?controls=1&showinfo=0&rel=0&modestbranding=1`}
                  className="w-full h-[400px] md:h-[500px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="mb-6 text-2xl font-bold text-white">Featured Videos</h3>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-12 h-12 rounded-full border-4 border-orange-500 animate-spin border-t-transparent"></div>
                </div>
              ) : (
                videos.slice(0, 4).map((video, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedVideo(video.videoId)}
                    className={`p-4 rounded-2xl backdrop-blur-sm transition cursor-pointer ${
                      selectedVideo === video.videoId ? 'bg-orange-500/30 ring-2 ring-orange-400' : 'bg-gray-900/50 hover:bg-gray-800/70'
                    } group`}
                  >
                    <div className="flex items-center">
                      <div className="overflow-hidden relative flex-shrink-0 w-32 h-20 rounded-xl">
                        <img src={video.image} alt={video.title} className="object-cover w-full h-full" />
                        <div className="flex absolute inset-0 justify-center items-center bg-black/40">
                          <i className="text-xl text-white fas fa-play"></i>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="mb-1 font-bold text-white line-clamp-2 group-hover:text-orange-300">{video.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{video.subtitle}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <i className="mr-1 fas fa-clock"></i> {video.duration}
                          <i className="mr-1 ml-3 fas fa-eye"></i> {video.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-center">
            <button className="px-10 py-4 text-lg font-bold text-white bg-orange-500 rounded-full shadow-lg transition hover:bg-orange-600">
              <i className="mr-3 fas fa-film"></i> View All Videos
            </button>
          </div>
        </div>
      </section>
      
      {/* Tour Packages Section - UPDATED WITH TIERED STRUCTURE */}
      <section id="packages" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Choose Your <span className="text-orange-400">Package</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              From budget-friendly to luxury experiences, we have the perfect package for every traveler
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {loadingPackages ? (
              // Loading skeleton
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="overflow-hidden bg-gray-800 rounded-3xl animate-pulse">
                  <div className="h-56 bg-gray-700"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : packages.length === 0 ? (
              // No packages message
              <div className="col-span-full py-20 text-center">
                <i className="mb-4 text-6xl text-gray-600 fas fa-box-open"></i>
                <p className="text-xl text-gray-400">No packages available at the moment.</p>
                <p className="mt-2 text-gray-500">Check back soon for amazing travel packages!</p>
              </div>
            ) : (
              // Display packages
              packages.map((pkg, index) => (
              <div
                key={index}
                className="overflow-hidden relative bg-gray-800 rounded-3xl transition-all duration-300 group hover:transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Tier Badge */}
                <div className="absolute top-0 right-0 left-0 z-10 p-4">
                  <div className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gradient-to-r ${pkg.gradient} rounded-full shadow-lg`}>
                    <i className="mr-2 fas fa-crown"></i>{pkg.tier.toUpperCase()}
                  </div>
                  {pkg.featured && (
                    <div className="inline-block ml-2">
                      <span className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                        <i className="mr-1 fas fa-star"></i> POPULAR
                      </span>
                    </div>
                  )}
                </div>

                {/* Package Image */}
                <div className="overflow-hidden relative h-56">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent via-gray-800/50"></div>
                  
                  {/* Package Name Overlay */}
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <h3 className="mb-1 text-2xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-sm text-orange-400">{pkg.tagline}</p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Rating */}
                  <div className="flex gap-2 items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      <i className="mr-1 text-sm fas fa-star"></i>
                      <span className="text-sm font-bold text-white">{pkg.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">({pkg.reviews} reviews)</span>
                  </div>

                  {/* Duration */}
                  <div className="flex gap-2 items-center mb-4 text-gray-300">
                    <i className="text-orange-400 fas fa-clock"></i>
                    <span className="text-sm font-medium">{pkg.duration}</span>
                  </div>

                  {/* Highlights */}
                  <div className="overflow-y-auto mb-4 space-y-2 max-h-48">
                    {pkg.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start text-sm text-gray-300">
                        <i className="flex-shrink-0 mt-1 mr-2 text-xs text-green-400 fas fa-check-circle"></i>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Includes Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.includes.slice(0, 4).map((item, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xs text-gray-400">Starting from</div>
                        <div className="text-2xl font-bold text-orange-400">{pkg.price}</div>
                        <div className="text-xs text-gray-500">{pkg.priceRange}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleBookNow(pkg.id)}
                        className="flex justify-center items-center px-6 py-3 w-full font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg transition hover:from-orange-600 hover:to-orange-700"
                      >
                        Book Now <i className="ml-2 fas fa-arrow-right"></i>
                      </button>
                      {pkg.tier !== 'custom' && (
                        <button 
                          onClick={() => handleBookNow(pkg.id)}
                          className="flex justify-center items-center px-6 py-2 w-full text-sm font-medium text-orange-400 bg-transparent rounded-xl border border-orange-400 transition hover:bg-orange-400/10"
                        >
                          <i className="mr-2 fas fa-cog"></i> Customize
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>

          {/* Package Comparison Section */}
          <div className="p-8 mt-12 bg-gray-800 rounded-3xl">
            <h3 className="mb-6 text-2xl font-bold text-center text-white">Not Sure Which Package?</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-6 text-center bg-gray-700 rounded-2xl">
                <i className="mb-4 text-4xl text-yellow-400 fas fa-medal"></i>
                <h4 className="mb-2 text-xl font-bold text-white">Gold - Best for Luxury</h4>
                <p className="text-sm text-gray-300">Perfect for travelers seeking premium experiences with all-inclusive luxury services and VIP treatment</p>
              </div>
              <div className="p-6 text-center bg-gray-700 rounded-2xl">
                <i className="mb-4 text-4xl text-gray-400 fas fa-medal"></i>
                <h4 className="mb-2 text-xl font-bold text-white">Silver - Best Value</h4>
                <p className="text-sm text-gray-300">Ideal balance of comfort and affordability with quality accommodation and guided experiences</p>
              </div>
              <div className="p-6 text-center bg-gray-700 rounded-2xl">
                <i className="mb-4 text-4xl text-orange-600 fas fa-medal"></i>
                <h4 className="mb-2 text-xl font-bold text-white">Platinum - Budget Friendly</h4>
                <p className="text-sm text-gray-300">Great for budget-conscious travelers who want essential services and authentic experiences</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="px-10 py-4 text-lg font-bold text-orange-400 bg-transparent rounded-full border-2 border-orange-400 transition hover:bg-orange-400 hover:text-white">
              <i className="mr-3 fas fa-phone-alt"></i> Need Help Choosing? Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section id='contact' className="overflow-hidden relative py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10"></div>
        
        <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Ready to Explore Sri Lanka?</h2>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-white/90">
            Book your dream Sri Lankan adventure today with our customized packages and expert local guides.
          </p>
          
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <button className="px-10 py-5 text-xl font-bold text-orange-600 bg-white rounded-full shadow-lg transition hover:bg-gray-100">
              <i className="mr-3 fas fa-calendar-check"></i> Book Your Trip
            </button>
            <button className="px-10 py-5 text-xl font-bold text-white bg-transparent rounded-full border-2 border-white transition hover:bg-white/10">
              <i className="mr-3 fas fa-phone-alt"></i> Call: +94 77 123 4567
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mx-auto mt-12 max-w-4xl md:grid-cols-4">
            <div className="text-white">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-white/80">Local Guides</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}

export default Home;