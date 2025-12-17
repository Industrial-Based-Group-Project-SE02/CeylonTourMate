import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      setProfile({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone || '',
        email: response.data.email
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/profile', profile);
      alert('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-blue-500 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

        {/* Profile Information */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex gap-2 items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex justify-center items-center w-24 h-24 text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={profile.email}
                  className="px-4 py-2 w-full text-gray-500 bg-gray-100 rounded-lg border border-gray-300"
                  disabled
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-800">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-semibold text-gray-800">{profile.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Change Password</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;