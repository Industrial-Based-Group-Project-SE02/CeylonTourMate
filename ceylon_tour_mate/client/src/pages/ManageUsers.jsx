// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import DashboardLayout from '../components/DashboardLayout';

// function ManageUsers() {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     phone: '',
//     role: user?.role === 'admin' ? 'manager' : 'driver'
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:5000/api/users');
//       setUsers(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load users');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/users', formData);
//       setShowModal(false);
//       setFormData({
//         email: '',
//         password: '',
//         firstName: '',
//         lastName: '',
//         phone: '',
//         role: user?.role === 'admin' ? 'manager' : 'driver'
//       });
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to create user');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/users/${id}`);
//         fetchUsers();
//       } catch (err) {
//         alert('Failed to delete user');
//       }
//     }
//   };

//   const handleToggleStatus = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/users/${id}/toggle-status`);
//       fetchUsers();
//     } catch (err) {
//       alert('Failed to update user status');
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     const colors = {
//       admin: 'bg-red-100 text-red-800',
//       manager: 'bg-blue-100 text-blue-800',
//       driver: 'bg-green-100 text-green-800',
//       tourist: 'bg-purple-100 text-purple-800',
//       hotel_agent: 'bg-orange-100 text-orange-800'
//     };
//     return colors[role] || 'bg-gray-100 text-gray-800';
//   };

//   const getProfileImageUrl = (picturePath) => {
//     if (!picturePath) return null;
//     return `http://localhost:5000${picturePath}`;
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <i className="text-4xl text-blue-500 fas fa-spinner fa-spin"></i>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
//             <p className="text-gray-600">
//               {user?.role === 'admin' ? 'Manage managers' : 'Manage drivers and hotel agents'}
//             </p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg transition hover:bg-blue-700"
//           >
//             <i className="fas fa-plus"></i>
//             Add {user?.role === 'admin' ? 'Manager' : 'User'}
//           </button>
//         </div>

//         {error && (
//           <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
//             {error}
//           </div>
//         )}

//         {/* Users Table */}
//         <div className="overflow-hidden bg-white rounded-xl shadow-lg">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((u) => (
//                   <tr key={u.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {u.profilePicture ? (
//                           <img
//                             src={getProfileImageUrl(u.profilePicture)}
//                             alt={`${u.firstName} ${u.lastName}`}
//                             className="object-cover w-10 h-10 rounded-full"
//                           />
//                         ) : (
//                           <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-blue-500 rounded-full">
//                             {u.firstName?.[0]}{u.lastName?.[0]}
//                           </div>
//                         )}
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {u.firstName} {u.lastName}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                       {u.email}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                       {u.phone || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
//                         {u.role.replace('_', ' ').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                         u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {u.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 space-x-3 text-sm font-medium whitespace-nowrap">
//                       <button
//                         onClick={() => handleToggleStatus(u.id)}
//                         className="text-blue-600 hover:text-blue-900"
//                         title={u.isActive ? 'Deactivate' : 'Activate'}
//                       >
//                         <i className={`fas ${u.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(u.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showModal && (
//         <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
//           <div className="p-8 m-4 w-full max-w-md bg-white rounded-2xl shadow-2xl">
//             <h2 className="mb-6 text-2xl font-bold text-gray-800">
//               Add New {user?.role === 'admin' ? 'Manager' : 'User'}
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-700">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                     className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-700">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                     className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {user?.role === 'manager' && (
//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
//                   <select
//                     value={formData.role}
//                     onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                     className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="driver">Driver</option>
//                     <option value="hotel_agent">Hotel Agent</option>
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
//                 <input
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
//                 >
//                   Create User
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }

// export default ManageUsers;

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import DashboardLayout from '../components/DashboardLayout';

// function ManageUsers() {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filters
//   const [filters, setFilters] = useState({
//     role: 'all',
//     status: 'all',
//     search: ''
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, [filters]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (filters.role !== 'all') params.append('role', filters.role);
//       if (filters.status !== 'all') params.append('status', filters.status);
//       if (filters.search.trim()) params.append('search', filters.search.trim());

//       const response = await axios.get(`http://localhost:5000/api/users?${params.toString()}`);
//       setUsers(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load users');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/users/${id}`);
//         fetchUsers();
//       } catch (err) {
//         alert('Failed to delete user');
//       }
//     }
//   };

//   const handleToggleStatus = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/users/${id}/toggle-status`);
//       fetchUsers();
//     } catch (err) {
//       alert('Failed to update user status');
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     const colors = {
//       admin: 'bg-red-100 text-red-800',
//       manager: 'bg-blue-100 text-blue-800',
//       driver: 'bg-green-100 text-green-800',
//       tourist: 'bg-purple-100 text-purple-800',
//       // hotel_agent: 'bg-orange-100 text-orange-800'
//     };
//     return colors[role] || 'bg-gray-100 text-gray-800';
//   };

//   const getProfileImageUrl = (picturePath) => {
//     if (!picturePath) return null;
//     return `http://localhost:5000${picturePath}`;
//   };

//   // Get available roles based on current user
//   const getAvailableRoles = () => {
//     if (user?.role === 'admin') {
//       return [
//         { value: 'all', label: 'All Roles' },
//         { value: 'manager', label: 'Manager' },
//         { value: 'driver', label: 'Driver' },
//         { value: 'tourist', label: 'Tourist' },
//         // { value: 'hotel_agent', label: 'Hotel Agent' }
//       ];
//     } else if (user?.role === 'manager') {
//       return [
//         { value: 'all', label: 'All Roles' },
//         { value: 'driver', label: 'Driver' },
//         { value: 'hotel_agent', label: 'Hotel Agent' }
//       ];
//     }
//     return [{ value: 'all', label: 'All Roles' }];
//   };

//   if (loading && !users.length) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <i className="text-4xl text-blue-500 fas fa-spinner fa-spin"></i>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
//             <p className="text-gray-600">
//               {user?.role === 'admin' ? 'Manage all system users' : 'Manage drivers and hotel agents'}
//             </p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="p-6 bg-white rounded-xl shadow-lg">
//           <h2 className="mb-4 text-lg font-bold text-gray-800">
//             <i className="mr-2 fas fa-filter"></i>
//             Filters & Search
//           </h2>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//             {/* Search */}
//             <div className="md:col-span-2">
//               <label className="block mb-2 text-sm font-semibold text-gray-700">
//                 <i className="mr-2 fas fa-search"></i>
//                 Search by Name or Email
//               </label>
//               <input
//                 type="text"
//                 value={filters.search}
//                 onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                 placeholder="Search users..."
//                 className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Role Filter */}
//             <div>
//               <label className="block mb-2 text-sm font-semibold text-gray-700">
//                 <i className="mr-2 fas fa-user-tag"></i>
//                 Filter by Role
//               </label>
//               <select
//                 value={filters.role}
//                 onChange={(e) => setFilters({ ...filters, role: e.target.value })}
//                 className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {getAvailableRoles().map(role => (
//                   <option key={role.value} value={role.value}>{role.label}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <label className="block mb-2 text-sm font-semibold text-gray-700">
//                 <i className="mr-2 fas fa-toggle-on"></i>
//                 Filter by Status
//               </label>
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                 className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Inactive Only</option>
//               </select>
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {(filters.role !== 'all' || filters.status !== 'all' || filters.search) && (
//             <div className="flex flex-wrap gap-2 items-center pt-4 mt-4 border-t">
//               <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
//               {filters.search && (
//                 <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
//                   Search: "{filters.search}"
//                   <button
//                     onClick={() => setFilters({ ...filters, search: '' })}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </span>
//               )}
//               {filters.role !== 'all' && (
//                 <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
//                   Role: {filters.role}
//                   <button
//                     onClick={() => setFilters({ ...filters, role: 'all' })}
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </span>
//               )}
//               {filters.status !== 'all' && (
//                 <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
//                   Status: {filters.status}
//                   <button
//                     onClick={() => setFilters({ ...filters, status: 'all' })}
//                     className="text-purple-600 hover:text-purple-800"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </span>
//               )}
//               <button
//                 onClick={() => setFilters({ role: 'all', status: 'all', search: '' })}
//                 className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-full transition hover:bg-red-100"
//               >
//                 Clear All
//               </button>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
//             {error}
//           </div>
//         )}

//         {/* Results Count */}
//         <div className="flex justify-between items-center">
//           <p className="text-gray-600">
//             Showing <span className="font-bold text-gray-800">{users.length}</span> user(s)
//           </p>
//           {loading && (
//             <i className="text-blue-500 fas fa-spinner fa-spin"></i>
//           )}
//         </div>

//         {/* Users Table */}
//         <div className="overflow-hidden bg-white rounded-xl shadow-lg">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((u) => (
//                   <tr key={u.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {u.profilePicture ? (
//                           <img
//                             src={getProfileImageUrl(u.profilePicture)}
//                             alt={`${u.firstName} ${u.lastName}`}
//                             className="object-cover w-10 h-10 rounded-full"
//                           />
//                         ) : (
//                           <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-blue-500 rounded-full">
//                             {u.firstName?.[0]}{u.lastName?.[0]}
//                           </div>
//                         )}
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {u.firstName} {u.lastName}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                       {u.email}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                       {u.phone || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
//                         {u.role.replace('_', ' ').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                         u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {u.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 space-x-3 text-sm font-medium whitespace-nowrap">
//                       <button
//                         onClick={() => handleToggleStatus(u.id)}
//                         className="text-blue-600 hover:text-blue-900"
//                         title={u.isActive ? 'Deactivate' : 'Activate'}
//                       >
//                         <i className={`fas ${u.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(u.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* No Results */}
//         {users.length === 0 && !loading && (
//           <div className="py-12 text-center bg-white rounded-xl shadow">
//             <i className="mb-4 text-6xl text-gray-300 fas fa-search"></i>
//             <h3 className="mb-2 text-xl font-semibold text-gray-800">No Users Found</h3>
//             <p className="text-gray-600">Try adjusting your filters or search terms</p>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// export default ManageUsers;


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: user?.role === 'admin' ? 'manager' : 'driver'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search.trim()) params.append('search', filters.search.trim());

      const response = await axios.get(`http://localhost:5000/api/users?${params.toString()}`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      alert(`${formData.role === 'manager' ? 'Manager' : 'User'} created successfully!`);
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: user?.role === 'admin' ? 'manager' : 'driver'
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/toggle-status`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      driver: 'bg-green-100 text-green-800',
      tourist: 'bg-purple-100 text-purple-800',
      hotel_agent: 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `http://localhost:5000${picturePath}`;
  };

  // Get available roles based on current user
  const getAvailableRoles = () => {
    if (user?.role === 'admin') {
      return [
        { value: 'all', label: 'All Roles' },
        { value: 'manager', label: 'Manager' },
        { value: 'driver', label: 'Driver' },
        { value: 'tourist', label: 'Tourist' },
        // { value: 'hotel_agent', label: 'Hotel Agent' }
      ];
    } else if (user?.role === 'manager') {
      return [
        { value: 'all', label: 'All Roles' },
        { value: 'driver', label: 'Driver' },
        // { value: 'hotel_agent', label: 'Hotel Agent' }
      ];
    }
    return [{ value: 'all', label: 'All Roles' }];
  };

  if (loading && !users.length) {
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
        {/* Header */}
        <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Manage all system users' : 'Manage drivers and hotel agents'}
            </p>
          </div>
          
          {/* Create Button - Only show for admin (manager creates drivers on dedicated Drivers page) */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg transition hover:bg-blue-700"
            >
              <i className="fas fa-user-plus"></i>
              Create Manager
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            <i className="mr-2 fas fa-filter"></i>
            Filters & Search
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-search"></i>
                Search by Name or Email
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search users..."
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-user-tag"></i>
                Filter by Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getAvailableRoles().map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-toggle-on"></i>
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.role !== 'all' || filters.status !== 'all' || filters.search) && (
            <div className="flex flex-wrap gap-2 items-center pt-4 mt-4 border-t">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {filters.search && (
                <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  Search: "{filters.search}"
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.role !== 'all' && (
                <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                  Role: {filters.role}
                  <button
                    onClick={() => setFilters({ ...filters, role: 'all' })}
                    className="text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: 'all' })}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilters({ role: 'all', status: 'all', search: '' })}
                className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-full transition hover:bg-red-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{users.length}</span> user(s)
          </p>
          {loading && (
            <i className="text-blue-500 fas fa-spinner fa-spin"></i>
          )}
        </div>

        {/* Users Table */}
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {u.profilePicture ? (
                          <img
                            src={getProfileImageUrl(u.profilePicture)}
                            alt={`${u.firstName} ${u.lastName}`}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-blue-500 rounded-full">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {u.firstName} {u.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
                        {u.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title={u.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas ${u.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {users.length === 0 && !loading && (
          <div className="py-12 text-center bg-white rounded-xl shadow">
            <i className="mb-4 text-6xl text-gray-300 fas fa-search"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Create Manager Modal (Admin Only) */}
      {showCreateModal && user?.role === 'admin' && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-2xl font-bold text-white">Create Manager Account</h2>
              <p className="text-blue-100">Add a new manager to the system</p>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+94771234567"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              {/* Info Box */}
              {/* <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-3 items-start">
                  <i className="mt-1 text-blue-600 fas fa-info-circle"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Manager Permissions:</p>
                    <ul className="mt-2 ml-4 space-y-1 list-disc">
                      <li>Can create and manage driver accounts</li>
                      <li>Can view and filter all users</li>
                      <li>Cannot create managers or admins</li>
                      <li>Has access to driver management page</li>
                    </ul>
                  </div>
                </div>
              </div> */}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                >
                  <i className="mr-2 fas fa-user-plus"></i>
                  Create Manager
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      email: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      phone: '',
                      role: 'manager'
                    });
                  }}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageUsers;