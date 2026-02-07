// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';


// function Sidebar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
//   const getProfileImageUrl = (picturePath) => {
//     if (!picturePath) return null;
//     return `http://localhost:5000${picturePath}`;
//   };

//   const navigation = {
//     admin: [
//       { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
//       { name: 'System Users', path: '/managers', icon: 'fas fa-users-cog' },
//       { name: 'Packages', path: '/ManagePackage', icon: 'fas fa-users-cog' },
//       { name: 'Bookings', path: '', icon: 'fas fa-calendar-check' },
//       { name: 'Advertisements', path: '/advertisements', icon: 'fas fa-bullhorn' },
//       { name: 'Driver Management', path: '/admin-drivers', icon: 'fas fa-car' },
//       { name: 'Feedbacks', path: '/feedbacks', icon: 'fas fa-comments' },
//       { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
//     ],
//     manager: [
//       { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
//       { name: 'Manage Package', path: '/ManagePackage', icon: 'fas fa-box' },
//       { name: 'Drivers', path: '/drivers', icon: 'fas fa-id-card' },
//       { name: 'Feedbacks', path: '/feedbacks', icon: 'fas fa-comments' },
//       { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
//     ],
//     tourist: [
//       { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
//       { name: 'Tour Packages', path: '/tourist/tour_package', icon: 'fas fa-suitcase' },
//       { name: 'Book a Trip', path: '/tourist/bookingForm', icon: 'fas fa-calendar-plus' },
//       { name: 'My Bookings', path: '/tourist/trip_history', icon: 'fas fa-calendar-check' },
//       { name: 'Feed Back', path: '/tourist/cutomerFeedback', icon: 'fas fa-comment-alt' },
//       { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
//     ],
//     driver: [
//       { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
//       { name: 'My Tours', path: '/my-tours', icon: 'fas fa-route' },
//       { name: 'Schedule', path: '/schedule', icon: 'fas fa-calendar' },
//       { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
//     ],
//     hotel_agent: [
//       { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
//       { name: 'Hotel Bookings', path: '/hotel-bookings', icon: 'fas fa-bed' },
//       { name: 'Reservations', path: '/reservations', icon: 'fas fa-clipboard-list' },
//       { name: 'Room Management', path: '/rooms', icon: 'fas fa-door-open' },
//       { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
//     ],
   
//   };

//   const currentNav = navigation[user?.role] || [];

//   return (
//     <>
//       {/* Mobile menu button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-4 left-4 z-50 p-2 text-white bg-orange-600 rounded-lg md:hidden"
//       >
//         <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
//       </button>

//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 w-64 bg-gradient-to-b from-orange-900 to-orange-800`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="p-6 border-b border-yellow-600">
//             <div className="flex gap-3 items-center">
//               <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
//                 <i className="text-xl text-white fas fa-umbrella-beach"></i>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-white">CeylonTourMate</h1>
//                 <p className="text-xs text-blue-200">{user?.role?.toUpperCase()}</p>
//               </div>
//             </div>
//           </div>

//           {/* User info with profile picture */}
//           <div className="p-4 border-b border-yellow-600">
//             <div className="flex gap-3 items-center">
//               {user?.profilePicture ? (
//                 <img
//                   src={getProfileImageUrl(user.profilePicture)}
//                   alt="Profile"
//                   className="object-cover w-12 h-12 rounded-full border-2 border-white"
//                 />
//               ) : (
//                 <div className="flex justify-center items-center w-12 h-12 text-lg font-bold text-blue-900 bg-white rounded-full">
//                   {user?.firstName?.[0]}{user?.lastName?.[0]}
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm font-semibold text-white">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-blue-200">{user?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="overflow-y-auto flex-1 p-4 space-y-2">
//             {currentNav.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                     isActive
//                       ? 'text-blue-900 bg-white'
//                       : 'text-white hover:bg-orange-700'
//                   }`}
//                 >
//                   <i className={item.icon}></i>
//                   <span className="font-medium">{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout */}
//           <div className="p-4 border-t border-yellow-600">
//             <button
//               onClick={handleLogout}
//               className="flex gap-3 items-center px-4 py-3 w-full text-left text-white rounded-lg transition-colors hover:bg-orange-700"
//             >
//               <i className="fas fa-sign-out-alt"></i>
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;


//////////////////////

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `http://localhost:5000${picturePath}`;
  };

  const navigation = {
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'System Users', path: '/managers', icon: 'fas fa-users-cog' },
      { name: 'Packages', path: '/ManagePackage', icon: 'fas fa-box' },
      { name: 'Bookings', path: '/bookings', icon: 'fas fa-calendar-check' },
      { name: 'Advertisements', path: '/advertisements', icon: 'fas fa-bullhorn' },
      { name: 'Driver Management', path: '/admin-drivers', icon: 'fas fa-car' },
      { name: 'Hotel Agents', path: '/admin-hotel-agents', icon: 'fas fa-hotel' },
      { name: 'Feedbacks', path: '/feedbacks', icon: 'fas fa-comments' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
    manager: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Manage Package', path: '/ManagePackage', icon: 'fas fa-box' },
      { name: 'Drivers', path: '/drivers', icon: 'fas fa-id-card' },
      { name: 'Hotel Agents', path: '/hotel-agents', icon: 'fas fa-hotel' },
      { name: 'Booking Approvals', path: '/manager/BookingApprovals', icon: 'fas fa-check-circle' },
      { name: 'Hotel Availability', path: '/manager/hotel-availability', icon: 'fas fa-bed' },
      { name: 'Feedbacks', path: '/feedbacks', icon: 'fas fa-comments' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },

    ],
    tourist: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Tour Packages', path: '/tourist/tour_package', icon: 'fas fa-suitcase' },
      { name: 'Book a Trip', path: '/tourist/bookingForm', icon: 'fas fa-calendar-plus' },
      { name: 'My Bookings', path: '/tourist/trip_history', icon: 'fas fa-calendar-check' },
      { name: 'Feed Back', path: '/tourist/cutomerFeedback', icon: 'fas fa-comment-alt' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
    //    driver: [
    //   { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
    //   // FIX: Path changed to match App.jsx
    //   { name: 'My Tours', path: '/driver/manage-tours', icon: 'fas fa-route' }, 
    //   { name: 'Schedule', path: '/schedule', icon: 'fas fa-calendar' },
    //   { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    // ],
driver: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'My Tours', path: '/driver/my_tour', icon: 'fas fa-route' },
      { name: 'Schedule', path: '/driver/view_schedule', icon: 'fas fa-calendar' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
      { name: 'Driver Details', path: '/driver/details', icon: 'fas fa-id-card' },

    ],
    // hotel_agent: [
    //   { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
    //   { name: 'Bookings', path: '/hotel-bookings', icon: 'fas fa-bed' },
    //   { name: 'Room Management', path: '/rooms', icon: 'fas fa-door-open' },
    //   { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    // ],
    hotel_agent: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Hotel Bookings', path: '/hotel-bookings', icon: 'fas fa-bed' },
      { name: 'Reservations', path: '/reservations', icon: 'fas fa-clipboard-list' },
      { name: 'Room Management', path: '/rooms', icon: 'fas fa-door-open' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
  };

  const currentNav = navigation[user?.role] || [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-white bg-orange-600 rounded-lg md:hidden"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-gradient-to-b from-orange-900 to-orange-800`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-yellow-600">
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                <i className="text-xl text-white fas fa-umbrella-beach"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CeylonTourMate</h1>
                <p className="text-xs text-blue-200">{user?.role?.toUpperCase().replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* User info with profile picture */}
          <div className="p-4 border-b border-yellow-600">
            <div className="flex gap-3 items-center">
              {user?.profilePicture ? (
                <img
                  src={getProfileImageUrl(user.profilePicture)}
                  alt="Profile"
                  className="object-cover w-12 h-12 rounded-full border-2 border-white"
                />
              ) : (
                <div className="flex justify-center items-center w-12 h-12 text-lg font-bold text-blue-900 bg-white rounded-full">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-blue-200">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="overflow-y-auto flex-1 p-4 space-y-2">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-900 bg-white'
                      : 'text-white hover:bg-orange-700'
                  }`}
                >
                  <i className={item.icon}></i>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-yellow-600">
            <button
              onClick={handleLogout}
              className="flex gap-3 items-center px-4 py-3 w-full text-left text-white rounded-lg transition-colors hover:bg-orange-700"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;