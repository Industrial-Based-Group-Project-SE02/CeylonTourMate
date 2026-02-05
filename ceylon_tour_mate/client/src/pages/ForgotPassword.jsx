import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/request-password-reset', {
        email
      });

      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-300 to-orange-400">
      <div className="p-8 m-4 w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
            <i className="text-3xl text-white fas fa-key"></i>
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Forgot Password?</h2>
        <p className="mb-8 text-center text-gray-600">
          Enter your email and we'll send you a reset link
        </p>

        {message && (
          <div className="flex gap-2 items-center p-4 mb-6 text-green-700 bg-green-100 rounded-lg border border-green-300">
            <i className="fas fa-check-circle"></i>
            <span>{message}</span>
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
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
                Sending...
              </>
            ) : (
              <>
                <i className="mr-2 fas fa-paper-plane"></i>
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">
            <i className="mr-2 fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;