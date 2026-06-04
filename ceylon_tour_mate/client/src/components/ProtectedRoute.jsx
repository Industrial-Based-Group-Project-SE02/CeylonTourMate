import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const allowed = allowedRoles.map(r => r.toString().toLowerCase());
    const role = user?.role ? user.role.toString().toLowerCase() : '';
    if (!allowed.includes(role)) return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;