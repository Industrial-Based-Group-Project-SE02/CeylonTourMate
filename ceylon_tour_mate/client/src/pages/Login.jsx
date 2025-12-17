import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900">
      <div className="p-8 m-4 w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
            <i className="text-3xl text-white fas fa-umbrella-beach"></i>
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="mb-8 text-center text-gray-600">Login to Ceylon Tour Mate</p>

        {error && (
          <div className="flex gap-2 items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-300">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@ceylontourmate.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 w-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg transition hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="mr-2 fas fa-spinner fa-spin"></i>
                Logging in...
              </>
            ) : (
              <>
                <i className="mr-2 fas fa-sign-in-alt"></i>
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register as Tourist
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="mb-2 text-xs font-semibold text-gray-700">Test Credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Admin:</strong> admin@ceylontourmate.com / Admin@123</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">
            <i className="mr-2 fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;