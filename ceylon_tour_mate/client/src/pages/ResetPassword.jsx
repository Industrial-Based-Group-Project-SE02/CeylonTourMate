import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      setError('Invalid reset link');
      setVerifying(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-reset-token', {
        token
      });

      setTokenValid(true);
      setUserEmail(response.data.email);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset link');
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });

      // Show success message and redirect
      alert('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-300 to-orange-400">
        <div className="p-8 text-center text-white">
          <i className="text-5xl fas fa-spinner fa-spin"></i>
          <p className="mt-4 text-xl">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-300 to-orange-400">
        <div className="p-8 m-4 w-full max-w-md text-center bg-white rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex justify-center items-center w-16 h-16 bg-red-100 rounded-full">
              <i className="text-3xl text-red-600 fas fa-times-circle"></i>
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Invalid Reset Link</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Link
            to="/forgot-password"
            className="inline-block px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition hover:from-blue-700 hover:to-purple-700"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-600 via-orange-300 to-orange-400">
      <div className="p-8 m-4 w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
            <i className="text-3xl text-white fas fa-lock"></i>
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Reset Password</h2>
        <p className="mb-8 text-center text-gray-600">
          Enter your new password for {userEmail}
        </p>

        {error && (
          <div className="flex gap-2 items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-300">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-lock"></i>
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-lock"></i>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
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
                Resetting Password...
              </>
            ) : (
              <>
                <i className="mr-2 fas fa-check"></i>
                Reset Password
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
            <i className="mr-2 fas fa-arrow-left"></i>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;