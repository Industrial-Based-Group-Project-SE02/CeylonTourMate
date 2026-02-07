import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function Dashboard() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black-100">Total Managers</p>
              <h3 className="mt-2 text-3xl font-bold text-black">12</h3>
            </div>
            <i className="text-4xl text-black-200 fas fa-users-cog"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black-100">Total Drivers</p>
              <h3 className="mt-2 text-3xl font-bold text-black">45</h3>
            </div>
            <i className="text-4xl text-black-100 fas fa-id-card"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black-100">Total Tourists</p>
              <h3 className="mt-2 text-3xl font-bold text-black">230</h3>
            </div>
            <i className="text-4xl text-black-100 fas fa-users"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-black">$45K</h3>
            </div>
            <i className="text-4xl text-black fas fa-dollar-sign"></i>
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
        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Active Drivers</p>
              <h3 className="mt-2 text-3xl font-bold text-black">15</h3>
            </div>
            <i className="text-4xl text-black fas fa-id-card"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Active Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-black">8</h3>
            </div>
            <i className="text-4xl text-black fas fa-route"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg black">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">All Bookings</p>
              <h3 className="mt-2 text-3xl font-bold text-black">12</h3>
            </div>
            <i className="text-4xl text-black fas fa-hotel"></i>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTouristDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Upcoming Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-black">3</h3>
            </div>
            <i className="text-4xl text-black fas fa-calendar-check"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Completed Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-black">5</h3>
            </div>
            
            <i className="text-4xl text-black fas fa-check-circle"></i>
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
        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Today's Tours</p>
              <h3 className="mt-2 text-3xl font-bold text-black">2</h3>
            </div>
            <i className="text-4xl text-black fas fa-route"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg black">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Hours Driven</p>
              <h3 className="mt-2 text-3xl font-bold text-black">145</h3>
            </div>
            <i className="text-4xl text-black fas fa-clock"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg black">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Rating</p>
              <h3 className="mt-2 text-3xl font-bold text-black">4.8</h3>
            </div>
            <i className="text-4xl text-black fas fa-star"></i>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHotelAgentDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Hotel Agent Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">Active Listings</p>
              <h3 className="mt-2 text-3xl font-bold text-black">0</h3>
            </div>
            <i className="text-4xl text-black fas fa-hotel"></i>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black">New Requests</p>
              <h3 className="mt-2 text-3xl font-bold text-black">0</h3>
            </div>
            <i className="text-4xl text-black fas fa-bell"></i>
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