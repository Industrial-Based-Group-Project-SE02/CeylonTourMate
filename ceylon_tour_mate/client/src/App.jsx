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
import Advertisements from './pages/Advertisements';  
import Drivers from './pages/Drivers';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

// Tourist Pages
import BookingForm from './pages/tourist/bookingForm'; 
import CustomerFeedback from './pages/tourist/cutomerFeedback'; 
import AdminDrivers from './pages/AdminDrivers';
import Feedbacks from './pages/Feedbacks';
import ManagePackage from './manager/ManagePackage';
import PackageDetails from './manager/PackageDetails';
import TourPackage from './pages/tourist/tour_package';
import TripHistory from './pages/tourist/trip_history';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

          {/* Protected Routes - with Sidebar Layout */}
          {/* Admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-drivers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDrivers />
            </ProtectedRoute>
          } />
          <Route
            path="/advertisements"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Advertisements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedbacks"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Feedbacks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute >
                <Profile />
              </ProtectedRoute>
            }
          />

         

         
          

          {/* // Manager & Admin - Your existing page */}
          <Route path="/drivers" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <Drivers />
            </ProtectedRoute>
          } />


          <Route 
          path="/ManagePackage"
            element={
              <ProtectedRoute role="manager">
                <ManagePackage />
              </ProtectedRoute>
            } 
            />
           <Route path="/package/:id" element={<PackageDetails />} />



          {/* Tourist Routes */}
          
          <Route
            path="/tourist/cutomerFeedback"
            element={
              <ProtectedRoute allowedRoles={['tourist']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <CustomerFeedback />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

         
         <Route
  path="/tourist/tour_package"
  element={
    <ProtectedRoute allowedRoles={['tourist']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <TourPackage />
        </div>
      </div>
    </ProtectedRoute>
  }
/>

          <Route
            path="/tourist/bookingForm"
            element={
              <ProtectedRoute allowedRoles={['tourist']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <BookingForm />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        <Route path="/tourist/trip_history" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 md:ml-64"><TripHistory /></div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="*" element={<div className="h-screen flex items-center justify-center"><h1>404 - Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;