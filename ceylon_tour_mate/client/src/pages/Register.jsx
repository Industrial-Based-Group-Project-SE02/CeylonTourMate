import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900">
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-300 to-orange-400">
      <div className="p-8 m-4 w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
            <i className="text-3xl text-white fas fa-umbrella-beach"></i>
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Join Us</h2>
        <p className="mb-8 text-center text-gray-600">Register as a Tourist</p>

        {error && (
          <div className="flex gap-2 items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-300">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              type="email"  
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-phone"></i>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-lock"></i>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Creating Account...
              </>
            ) : (
              <>
                <i className="mr-2 fas fa-user-plus"></i>
                Register
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          </p>
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

export default Register;