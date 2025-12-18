import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; // Add this import
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
import BookingForm from './pages/tourist/bookingForm'; 
import CustomerFeedback from './pages/tourist/cutomerFeedback'; 
import AdminDrivers from './pages/AdminDrivers';
import DriverManagement from './pages/tourist/driverManagement'; // Add this import
import Feedbacks from './pages/Feedbacks';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - with Navbar */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gray-50">
                <div className="relative">
                  <div className="absolute top-0 right-0 left-0 z-50">
                    <Navbar />
                  </div>
                  <Home />
                </div>
                <Footer />
              </div>
            }
          />

          {/* Auth Routes - no Navbar */}
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

         <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AdminDrivers />
              </ProtectedRoute>
            }
          />

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

          {/* Manager Routes - Driver Management */}
          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Drivers />
              </ProtectedRoute>
            }
          />
		  

          

          {/* Manager Routes */}
          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <ManageUsers />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hotel-agents"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <ManageUsers />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
              <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;