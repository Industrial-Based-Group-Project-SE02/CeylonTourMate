// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './components/Home';
// import Users from './pages/Users';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <div className="relative">
//           <div className="absolute top-0 right-0 left-0 z-50">
//             <Navbar />
//           </div>
          
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/users" element={<Users />} />
//           </Routes>
//         </div>
        
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;



// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './components/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import ManageUsers from './pages/ManageUsers';
// import Profile from './pages/Profile';
// import Unauthorized from './pages/Unauthorized';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Routes - with Navbar */}
//           <Route
//             path="/"
//             element={
//               <div className="min-h-screen bg-gray-50">
//                 <div className="relative">
//                   <div className="absolute top-0 right-0 left-0 z-50">
//                     <Navbar />
//                   </div>
//                   <Home />
//                 </div>
//                 <Footer />
//               </div>
//             }
//           />

//           {/* Auth Routes - no Navbar */}
          
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Protected Routes - with Sidebar (no Navbar) */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin Routes */}
//           <Route
//             path="/managers"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <ManageUsers />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/all-users"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <ManageUsers />
//               </ProtectedRoute>
//             }
//           />

//           {/* Manager Routes */}
//           <Route
//             path="/drivers"
//             element={
//               <ProtectedRoute allowedRoles={['manager']}>
//                 <ManageUsers />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/hotel-agents"
//             element={
//               <ProtectedRoute allowedRoles={['manager']}>
//                 <ManageUsers />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

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
import DriverManagement from './pages/tourist/driverManagement'; // Add this import

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
          
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <Dashboard />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <Profile />
                  </div>
                </div>
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
            path="/tourist/driverManagement"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <DriverManagement />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/managers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
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
            path="/all-users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 md:ml-64">
                    <ManageUsers />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* NEW: Advertisements Route - Admin Only */}
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
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
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