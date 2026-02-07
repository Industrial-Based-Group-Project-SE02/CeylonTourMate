import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function AdminHotelAgents() {
  const [hotelAgents, setHotelAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchHotelAgents();
  }, []);

  const fetchHotelAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users?role=hotel_agent');
      setHotelAgents(response.data);
    } catch (err) {
      console.error('Error fetching hotel agents:', err);
      alert('Failed to load hotel agents');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `http://localhost:5000${picturePath}`;
  };

  const filteredAgents = hotelAgents.filter(agent => {
    const matchesSearch = 
      agent.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && agent.isActive) ||
      (statusFilter === 'inactive' && !agent.isActive);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-600 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hotel Agents Overview</h1>
          <p className="text-gray-600">View and search hotel agent information</p>
        </div>

        {/* Filters */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-search"></i>
                Search Hotel Agents
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-filter"></i>
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 items-center pt-4 mt-4 border-t">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {searchTerm && (
                <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-full transition hover:bg-red-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white">Total Hotel Agents</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{hotelAgents.length}</h3>
              </div>
              <i className="text-4xl text-white fas fa-hotel"></i>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white">Active Agents</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {hotelAgents.filter(a => a.isActive).length}
                </h3>
              </div>
              <i className="text-4xl text-white fas fa-check-circle"></i>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white">Inactive Agents</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {hotelAgents.filter(a => !a.isActive).length}
                </h3>
              </div>
              <i className="text-4xl text-white fas fa-ban"></i>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600">
          Showing <span className="font-bold text-gray-800">{filteredAgents.length}</span> of {hotelAgents.length} hotel agent(s)
        </p>

        {/* Hotel Agents Table */}
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {agent.profilePicture ? (
                          <img
                            src={getProfileImageUrl(agent.profilePicture)}
                            alt={`${agent.firstName} ${agent.lastName}`}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-orange-500 rounded-full">
                            {agent.firstName?.[0]}{agent.lastName?.[0]}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {agent.firstName} {agent.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(agent)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl shadow">
            <i className="mb-4 text-6xl text-gray-300 fas fa-search"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Hotel Agents Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedAgent && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="px-8 py-6 bg-orange-600">
              <h2 className="text-2xl font-bold text-white">Hotel Agent Details</h2>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex gap-4 items-center">
                {selectedAgent.profilePicture ? (
                  <img
                    src={getProfileImageUrl(selectedAgent.profilePicture)}
                    alt="Profile"
                    className="object-cover w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="flex justify-center items-center w-20 h-20 text-2xl font-bold text-white bg-orange-500 rounded-full">
                    {selectedAgent.firstName?.[0]}{selectedAgent.lastName?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedAgent.firstName} {selectedAgent.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAgent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedAgent.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Status</p>
                  <p className={selectedAgent.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {selectedAgent.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Created At</p>
                  <p className="text-gray-900">
                    {new Date(selectedAgent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Role</p>
                  <p className="text-gray-900">Hotel Agent</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="mb-2 text-sm font-semibold text-gray-500">Account ID</p>
                <p className="font-mono text-gray-900">{selectedAgent.id}</p>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminHotelAgents;