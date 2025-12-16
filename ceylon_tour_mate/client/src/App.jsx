// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Drivers from './pages/Drivers';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

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

          {/* Protected Routes - with Sidebar (no Navbar) */}
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

          {/* Admin Routes */}
          <Route
            path="/managers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/all-users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes - UPDATED */}
          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Drivers />
              </ProtectedRoute>
            }
          />

          {/* Keep hotel-agents route if you still need it */}
          <Route
            path="/hotel-agents"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;