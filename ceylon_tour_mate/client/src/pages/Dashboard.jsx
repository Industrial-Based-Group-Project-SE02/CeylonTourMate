import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function Dashboard() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Total Managers</p>
              <h3 className="mt-2 text-3xl font-bold text-white">12</h3>
            </div>
            <i className="text-4xl text-blue-200 fas fa-users-cog"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Total Drivers</p>
              <h3 className="mt-2 text-3xl font-bold text-white">45</h3>
            </div>
            <i className="text-4xl text-green-200 fas fa-id-card"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100">Total Tourists</p>
              <h3 className="mt-2 text-3xl font-bold text-white">230</h3>
            </div>
            <i className="text-4xl text-purple-200 fas fa-users"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100">Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-white">$45K</h3>
            </div>
            <i className="text-4xl text-orange-200 fas fa-dollar-sign"></i>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
            <i className="text-2xl text-blue-500 fas fa-user-plus"></i>
            <div>
              <p className="font-semibold text-gray-800">New Manager Added</p>
              <p className="text-sm text-gray-600">John Doe joined as manager</p>
            </div>
          </div>
          <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
            <i className="text-2xl text-green-500 fas fa-check-circle"></i>
            <div>
              <p className="font-semibold text-gray-800">Tour Completed</p>
              <p className="text-sm text-gray-600">Sigiriya Tour completed successfully</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Active Drivers</p>
              <h3 className="mt-2 text-3xl font-bold text-white">15</h3>
            </div>
            <i className="text-4xl text-blue-200 fas fa-id-card"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Active Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-white">8</h3>
            </div>
            <i className="text-4xl text-green-200 fas fa-route"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100">Hotel Agents</p>
              <h3 className="mt-2 text-3xl font-bold text-white">12</h3>
            </div>
            <i className="text-4xl text-purple-200 fas fa-hotel"></i>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTouristDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Upcoming Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-white">3</h3>
            </div>
            <i className="text-4xl text-blue-200 fas fa-calendar-check"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Completed Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-white">5</h3>
            </div>
            
            <i className="text-4xl text-green-200 fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Explore Sri Lanka</h2>
        <p className="text-gray-600">Discover amazing destinations and book your next adventure!</p>
      </div>
    </div>
  );

  const renderDriverDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Today's Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-white">2</h3>
            </div>
            <i className="text-4xl text-blue-200 fas fa-route"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Hours Driven</p>
              <h3 className="mt-2 text-3xl font-bold text-white">145</h3>
            </div>
            <i className="text-4xl text-green-200 fas fa-clock"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100">Rating</p>
              <h3 className="mt-2 text-3xl font-bold text-white">4.8</h3>
            </div>
            <i className="text-4xl text-purple-200 fas fa-star"></i>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHotelAgentDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Hotel Agent Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Active Bookings</p>
              <h3 className="mt-2 text-3xl font-bold text-white">18</h3>
            </div>
            <i className="text-4xl text-blue-200 fas fa-bed"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100">Properties</p>
              <h3 className="mt-2 text-3xl font-bold text-white">5</h3>
            </div>
            <i className="text-4xl text-green-200 fas fa-building"></i>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'manager':
        return renderManagerDashboard();
      case 'tourist':
        return renderTouristDashboard();
      case 'driver':
        return renderDriverDashboard();
      case 'hotel_agent':
        return renderHotelAgentDashboard();
      default:
        return <p>Unknown role</p>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}

export default Dashboard;