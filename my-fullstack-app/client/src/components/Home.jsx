import { useState, useEffect } from 'react';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const destinations = [
    {
      image: 'https://images.unsplash.com/photo-1593693399741-6c36df2a7f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Sigiriya Rock Fortress',
      description: 'Ancient rock fortress with stunning frescoes and panoramic views',
      price: '$85',
      tags: ['Cultural', 'Historical']
    },
    {
      image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3e2ede5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Ella & Tea Country',
      description: 'Mountain views, waterfalls, and scenic train rides through tea plantations',
      price: '$65',
      tags: ['Nature', 'Adventure']
    },
    {
      image: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Galle Fort',
      description: 'Dutch colonial architecture, boutique shops, and sunset views',
      price: '$75',
      tags: ['Coastal', 'Historical']
    },
    {
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Yala National Park',
      description: 'Spot leopards, elephants, and exotic birds in Sri Lanka\'s premier wildlife sanctuary',
      price: '$95',
      tags: ['Wildlife', 'Safari']
    },
    {
      image: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Mirissa Beach',
      description: 'Golden sands, palm trees, and the best whale watching in Sri Lanka',
      price: '$55',
      tags: ['Beach', 'Whale Watching']
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

  const videos = [
    {
      image: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Cultural Heritage',
      subtitle: 'Ancient cities and temples',
      duration: '4:32',
      views: '24K'
    },
    {
      image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3e2ede5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Tea Country',
      subtitle: 'Scenic train journeys',
      duration: '3:15',
      views: '18K'
    },
    {
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Wildlife Safari',
      subtitle: 'National parks & elephants',
      duration: '5:20',
      views: '32K'
    },
    {
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Tropical Beaches',
      subtitle: 'Coastal paradise',
      duration: '4:05',
      views: '28K'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Hero Section with Video Background */}
      <section className="overflow-hidden relative h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/vedio1.mp4" type="video/mp4" />
            {/* Fallback image */}
            <img
              src="https://images.unsplash.com/photo-1591273531346-bd946dab7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Sri Lanka Beach"
              className="object-cover w-full h-full"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 z-20 transform -translate-x-1/2">
          <a href="#destinations" className="text-white animate-bounce">
            <i className="text-3xl fas fa-chevron-down"></i>
          </a>
        </div>
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
                onClick={() => alert(`Selected: ${dest.title}\nFrom ${dest.price}`)}
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
                    <div>
                      <div className="text-2xl font-bold text-orange-300">From {dest.price}</div>
                      <div className="text-sm text-gray-300">per person</div>
                    </div>
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
      <section className="relative py-20 bg-black">
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
                  src="https://www.youtube.com/embed/6Lw2SdcT0To?controls=0&showinfo=0&rel=0&modestbranding=1"
                  className="w-full h-[400px] md:h-[500px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-full">
                    <i className="mr-2 fas fa-play"></i> LIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="mb-6 text-2xl font-bold text-white">Featured Videos</h3>
              {videos.map((video, index) => (
                <div key={index} className="p-4 rounded-2xl backdrop-blur-sm transition cursor-pointer bg-gray-900/50 hover:bg-gray-800/70 group">
                  <div className="flex items-center">
                    <div className="overflow-hidden relative flex-shrink-0 w-32 h-20 rounded-xl">
                      <img src={video.image} alt={video.title} className="object-cover w-full h-full" />
                      <div className="flex absolute inset-0 justify-center items-center bg-black/40">
                        <i className="text-xl text-white fas fa-play"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="mb-1 font-bold text-white group-hover:text-orange-300">{video.title}</h4>
                      <p className="text-sm text-gray-400">{video.subtitle}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <i className="mr-1 fas fa-clock"></i> {video.duration}
                        <i className="mr-1 ml-3 fas fa-eye"></i> {video.views} views
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button className="px-10 py-4 text-lg font-bold text-white bg-orange-500 rounded-full shadow-lg transition hover:bg-orange-600">
              <i className="mr-3 fas fa-film"></i> View All Videos
            </button>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Unique Sri Lankan <span className="text-orange-400">Experiences</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              Immerse yourself in authentic Sri Lankan culture and adventure
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp, index) => (
              <div key={index} className="p-8 bg-gray-800 rounded-3xl transition hover:bg-gray-700 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${exp.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${exp.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">{exp.title}</h3>
                <p className="mb-6 text-gray-300">{exp.description}</p>
                <a href="#" className="inline-flex items-center font-bold text-orange-400 group-hover:text-orange-300">
                  Book Experience <i className="ml-2 transition-transform fas fa-arrow-right group-hover:translate-x-2"></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="overflow-hidden relative py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500">
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