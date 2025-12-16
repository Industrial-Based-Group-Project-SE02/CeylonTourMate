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

  const navigation = {
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Managers', path: '/managers', icon: 'fas fa-users-cog' },
      { name: 'All Users', path: '/all-users', icon: 'fas fa-users' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
    manager: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Drivers', path: '/drivers', icon: 'fas fa-id-card' },
      { name: 'Hotel Agents', path: '/hotel-agents', icon: 'fas fa-hotel' },
      { name: 'Driver Management', path: '/tourist/driverManagement', icon: 'fas fa-car' }, // Fixed icon
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
    tourist: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Tour Packages', path: '/packages', icon: 'fas fa-suitcase' },
      { name: 'My Bookings', path: '/my-bookings', icon: 'fas fa-calendar-check' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
      { name: 'Book a Trip', path: '/tourist/bookingForm', icon: 'fas fa-calendar-plus' },
      { name: 'Feed Back', path: '/tourist/cutomerFeedback', icon: 'fas fa-comment-alt' },
    ],
    driver: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'My Tours', path: '/my-tours', icon: 'fas fa-route' },
      { name: 'Schedule', path: '/schedule', icon: 'fas fa-calendar' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ],
    hotel_agent: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Bookings', path: '/hotel-bookings', icon: 'fas fa-bed' },
      { name: 'Properties', path: '/properties', icon: 'fas fa-building' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    ]
  };

  const currentNav = navigation[user?.role] || [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-lg md:hidden"
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
        } md:translate-x-0 w-64 bg-gradient-to-b from-blue-900 to-blue-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-blue-600">
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                <i className="text-xl text-white fas fa-umbrella-beach"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Ceylon Tour Mate</h1>
                <p className="text-xs text-blue-200">{user?.role?.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-blue-600">
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center w-12 h-12 text-lg font-bold text-blue-900 bg-white rounded-full">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
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
                      : 'text-white hover:bg-blue-800'
                  }`}
                >
                  <i className={item.icon}></i>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-600">
            <button
              onClick={handleLogout}
              className="flex gap-3 items-center px-4 py-3 w-full text-left text-white rounded-lg transition-colors hover:bg-red-600"
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