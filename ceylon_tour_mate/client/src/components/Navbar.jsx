// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="relative z-20 px-4 py-6 md:px-12">
//       <div className="container flex justify-between items-center mx-auto">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
//             <i className="text-2xl text-white fas fa-umbrella-beach"></i>
//           </div>
//           <div>
//             <Link to="/" className="text-2xl font-bold text-white">
//               Sri Lanka<span className="text-orange-400">Travel</span>
//             </Link>
//             <p className="text-xs text-gray-300">Discover The Pearl of the Indian Ocean</p>
//           </div>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden space-x-8 md:flex">
//           <Link to="/" className="font-medium text-white transition-colors hover:text-orange-300">
//             Home
//           </Link>
//           <a href="#destinations" className="font-medium text-white transition-colors hover:text-orange-300">
//             Destinations
//           </a>
//           <a href="#experiences" className="font-medium text-white transition-colors hover:text-orange-300">
//             Experiences
//           </a>
//           <a href="#packages" className="font-medium text-white transition-colors hover:text-orange-300">
//             Packages
//           </a>
//           <a href="#contact" className="font-medium text-white transition-colors hover:text-orange-300">
//             Contact
//           </a>
//           <Link to="/users" className="font-medium text-white transition-colors hover:text-orange-300">
//             Users
//           </Link>
//         </div>

//         {/* Book Now Button */}
//         <button className="hidden px-6 py-2 font-medium text-white bg-orange-500 rounded-full transition-colors md:block hover:bg-orange-600">
//           Book Now <i className="ml-2 fas fa-arrow-right"></i>
//         </button>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="text-white md:hidden hover:text-orange-300 focus:outline-none"
//         >
//           <svg
//             className="w-8 h-8"
//             fill="none"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             {isOpen ? (
//               <path d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="mt-4 md:hidden">
//           <div className="flex flex-col p-4 space-y-3 rounded-2xl backdrop-blur-sm bg-black/80">
//             <Link 
//               to="/" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Home
//             </Link>
//             <a 
//               href="#destinations" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Destinations
//             </a>
//             <a 
//               href="#experiences" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Experiences
//             </a>
//             <a 
//               href="#packages" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Packages
//             </a>
//             <a 
//               href="#contact" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Contact
//             </a>
//             <Link 
//               to="/users" 
//               className="py-2 font-medium text-white transition-colors hover:text-orange-300"
//               onClick={() => setIsOpen(false)}
//             >
//               Users
//             </Link>
//             <button className="px-6 py-2 mt-2 font-medium text-white bg-orange-500 rounded-full transition-colors hover:bg-orange-600">
//               Book Now <i className="ml-2 fas fa-arrow-right"></i>
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;



import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="relative z-20 px-4 py-6 md:px-12">
      <div className="container flex justify-between items-center mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
            <i className="text-2xl text-white fas fa-umbrella-beach"></i>
          </div>
          <div>
            <Link to="/" className="text-2xl font-bold text-white">
              Ceylon<span className="text-orange-400">TourMate</span>
            </Link>
            <p className="text-xs text-gray-300">Discover The Pearl of the Indian Ocean</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden space-x-8 md:flex">
          <Link to="/" className="font-medium text-white transition-colors hover:text-orange-300">
            Home
          </Link>
          <a href="#destinations" className="font-medium text-white transition-colors hover:text-orange-300">
            Destinations
          </a>
          <a href="#experiences" className="font-medium text-white transition-colors hover:text-orange-300">
            Experiences
          </a>
          <a href="#packages" className="font-medium text-white transition-colors hover:text-orange-300">
            Packages
          </a>
          <a href="#contact" className="font-medium text-white transition-colors hover:text-orange-300">
            Contact
          </a>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-2 font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-colors hover:from-orange-600 hover:to-pink-600"
            >
              <i className="mr-2 fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 font-medium text-white rounded-full backdrop-blur-sm transition-colors bg-white/10 hover:bg-white/20"
              >
                <i className="mr-2 fas fa-sign-in-alt"></i>
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 font-medium text-white bg-orange-500 rounded-full transition-colors hover:bg-orange-600"
              >
                <i className="mr-2 fas fa-user-plus"></i>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden hover:text-orange-300 focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 md:hidden">
          <div className="flex flex-col p-4 space-y-3 rounded-2xl backdrop-blur-sm bg-black/80">
            <Link 
              to="/" 
              className="py-2 font-medium text-white transition-colors hover:text-orange-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#destinations" 
              className="py-2 font-medium text-white transition-colors hover:text-orange-300"
              onClick={() => setIsOpen(false)}
            >
              Destinations
            </a>
            <a 
              href="#experiences" 
              className="py-2 font-medium text-white transition-colors hover:text-orange-300"
              onClick={() => setIsOpen(false)}
            >
              Experiences
            </a>
            <a 
              href="#packages" 
              className="py-2 font-medium text-white transition-colors hover:text-orange-300"
              onClick={() => setIsOpen(false)}
            >
              Packages
            </a>
            <a 
              href="#contact" 
              className="py-2 font-medium text-white transition-colors hover:text-orange-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 mt-3 space-y-2 border-t border-gray-600">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-colors hover:from-orange-600 hover:to-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white rounded-full backdrop-blur-sm transition-colors bg-white/10 hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex gap-2 justify-center items-center px-6 py-3 font-medium text-white bg-orange-500 rounded-full transition-colors hover:bg-orange-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-user-plus"></i>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;