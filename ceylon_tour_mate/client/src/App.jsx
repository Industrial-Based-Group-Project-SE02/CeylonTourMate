

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; 
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Advertisements from './pages/Advertisements';  
import Drivers from './pages/Drivers';
import HotelAgents from './pages/HotelAgents';
import AdminHotelAgents from './pages/AdminHotelAgents';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

// Tourist Pages
import BookingForm from './pages/tourist/bookingForm'; 
import CustomerFeedback from './pages/tourist/cutomerFeedback'; 
import AdminDrivers from './pages/AdminDrivers';
import Feedbacks from './pages/Feedbacks';
import TourPackageDetails from './pages/tourist/TourPackageDetails';
import PackageDetails from './pages/tourist/PackageDetails';
import TripHistory from './pages/tourist/trip_history';
import '@fortawesome/fontawesome-free/css/all.min.css';


import BookingApprovals from "./pages/manager/BookingApprovals";
import ManagePackage from './pages/manager/managePackage';
import DriverTourTasks from "./pages/manager/DriverTourTasks";

import CreatePackage from './pages/manager/CreatePackage';

import MyTour from './pages/driver/my_tour';
import ViewSchedule from "./pages/driver/view_shedule";
import DriverDetails from "./pages/driver/driverDetails";

function App() {
  // Helper to wrap pages with Sidebar layout
  const withSidebar = (Component, allowedRoles = []) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="overflow-y-auto flex-1 h-screen md:ml-64">
          <Component />
        </div>
      </div>
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========================================= */}
          {/* PUBLIC ROUTES - No authentication needed */}
          {/* ========================================= */}
          
          {/* Home Page */}
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

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* 🔥 PASSWORD RECOVERY ROUTES - PUBLIC */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ========================================= */}
          {/* PROTECTED ROUTES - Authentication required */}
          {/* ========================================= */}
          
          {/* Common Routes (All authenticated users) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/managers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin-drivers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDrivers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-hotel-agents" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHotelAgents />
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

          {/* Manager Routes */}
          <Route 
            path="/drivers" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Drivers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hotel-agents" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <HotelAgents />
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
            path="/manager/ManagePackage"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <ManagePackage />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

           <Route
          path="/manager/driver-tasks"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 p-4 md:ml-64">
                  <DriverTourTasks />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/ManagePackage"
            element={
              <ProtectedRoute role="manager">
                <ManagePackage />
              </ProtectedRoute>
            } 
            />
           <Route path="/package/:id" element={<PackageDetails />} />

  <Route path="/manager/packages/create" element={<CreatePackage />} />
        <Route path="/manager/packages/edit/:id" element={<CreatePackage />} /> {/* For editing */}
      


          <Route 
          path="/manager/BookingApprovals"
            element={
              <ProtectedRoute role="manager">
                    <Sidebar />
                <BookingApprovals />
              </ProtectedRoute>
            } 
            />
           <Route path="/package/:id" element={<BookingApprovals />} />

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
          <Route 
            path="/tourist/trip_history" 
            element={
              <ProtectedRoute allowedRoles={['tourist']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <TripHistory />
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
          <TourPackageDetails/>
        </div>
      </div>
    </ProtectedRoute>
  }
/>
          {/* Hotel Agent Routes */}
          <Route
            path="/hotel-bookings"
            element={
              <ProtectedRoute allowedRoles={['hotel_agent']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <div className="p-8">
                      <h1 className="text-3xl font-bold">Hotel Bookings</h1>
                      <p className="mt-2 text-gray-600">Manage hotel bookings (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['hotel_agent']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <div className="p-8">
                      <h1 className="text-3xl font-bold">Reservations</h1>
                      <p className="mt-2 text-gray-600">Manage reservations (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute allowedRoles={['hotel_agent']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <div className="p-8">
                      <h1 className="text-3xl font-bold">Room Management</h1>
                      <p className="mt-2 text-gray-600">Manage rooms (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Driver */}
          <Route
            path="/driver/my_tour"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <MyTour />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/view_schedule"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <ViewSchedule />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />



{/* driver */}

            <Route
  path="/driver/details"  // Use a cleaner, lowercase URL path
  element={
    <ProtectedRoute allowedRoles={['driver']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <DriverDetails />
        </div>
      </div>
    </ProtectedRoute>
  }
/>

          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
                  <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;