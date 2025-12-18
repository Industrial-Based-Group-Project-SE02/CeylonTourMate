import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Advertisements from './pages/Advertisements';  // NEW IMPORT
import Drivers from './pages/Drivers';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

// Tourist Pages
import BookingForm from './pages/tourist/bookingForm'; 
import CustomerFeedback from './pages/tourist/cutomerFeedback'; 
import TourPackage from './pages/tourist/tour_package';
import TripHistory from './pages/tourist/trip_history';

// Manager/Driver Pages
import DriverManagement from './pages/tourist/driverManagement';
import TourManagement from './pages/driver/TourManagement';

function App() {
  // Helper to wrap pages with Sidebar layout
  const withSidebar = (Component, allowedRoles = []) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 h-screen overflow-y-auto">
          <Component />
        </div>
      </div>
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected General Routes */}
          <Route path="/dashboard" element={withSidebar(Dashboard)} />
          <Route path="/profile" element={withSidebar(Profile)} />

          {/* Tourist Specific Routes */}
          <Route path="/tourist/tour_package" element={withSidebar(TourPackage, ['tourist'])} />
          <Route path="/tourist/trip_history" element={withSidebar(TripHistory, ['tourist'])} />
          <Route path="/tourist/bookingForm" element={withSidebar(BookingForm, ['tourist'])} />
          <Route path="/tourist/cutomerFeedback" element={withSidebar(CustomerFeedback, ['tourist'])} />

          {/* Manager & Admin Routes */}
          <Route path="/tourist/driverManagement" element={withSidebar(DriverManagement, ['manager'])} />
          <Route path="/drivers" element={withSidebar(ManageUsers, ['manager'])} />
          <Route path="/managers" element={withSidebar(ManageUsers, ['admin'])} />
          <Route path="/all-users" element={withSidebar(ManageUsers, ['admin'])} />
          <Route path="/hotel-agents" element={withSidebar(ManageUsers, ['manager'])} />

          {/* Driver Routes */}
          <Route path="/driver/manage-tours" element={withSidebar(TourManagement, ['driver'])} />

          <Route path="*" element={<div className="h-screen flex items-center justify-center"><h1>404 - Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;