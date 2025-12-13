function Footer() {
  return (
    <footer className="pt-16 pb-8 text-white bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 mb-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="relative pb-3 mb-6 text-xl font-semibold">
              CeylonTourMate
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <p className="mb-5 leading-relaxed text-gray-400">
              Your comprehensive solution for travel agency management. Streamline operations, delight customers, and grow your business.
            </p>
            <div className="flex gap-4 mt-5">
              <a 
                href="#" 
                className="flex justify-center items-center w-10 h-10 bg-white bg-opacity-10 rounded-full transition duration-300 hover:bg-orange-500"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="flex justify-center items-center w-10 h-10 bg-white bg-opacity-10 rounded-full transition duration-300 hover:bg-orange-500"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="flex justify-center items-center w-10 h-10 bg-white bg-opacity-10 rounded-full transition duration-300 hover:bg-orange-500"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="flex justify-center items-center w-10 h-10 bg-white bg-opacity-10 rounded-full transition duration-300 hover:bg-orange-500"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="relative pb-3 mb-6 text-xl font-semibold">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="relative pb-3 mb-6 text-xl font-semibold">
              Services
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Booking Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Customer CRM
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Payment Processing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Travel Itineraries
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition duration-300 hover:text-orange-500">
                  Analytics & Reporting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="relative pb-3 mb-6 text-xl font-semibold">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-2 items-start">
                <i className="mt-1 fas fa-map-marker-alt"></i>
                <span>123 Travel Street, Suite 456</span>
              </li>
              <li className="flex gap-2 items-center">
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-2 items-center">
                <i className="fas fa-envelope"></i>
                <span>info@ceylontourmate.com</span>
              </li>
              <li className="flex gap-2 items-center">
                <i className="fas fa-clock"></i>
                <span>Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center border-t border-gray-800">
          <p className="text-sm text-gray-400">
            &copy; 2024 CeylonTourMate Travel Agency Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;