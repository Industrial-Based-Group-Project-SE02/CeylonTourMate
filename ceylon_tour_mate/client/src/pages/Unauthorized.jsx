import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <i className="text-6xl text-red-500 fas fa-ban"></i>
        <h1 className="mt-4 text-4xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 mt-6 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;