import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, TrendingUp } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function Advertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    linkUrl: '',
    linkText: '',
    startDate: '',
    endDate: '',
    displayOrder: 0,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/advertisements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      alert('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('linkUrl', formData.linkUrl);
      formDataToSend.append('linkText', formData.linkText);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('displayOrder', formData.displayOrder);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/advertisements/${editingId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Advertisement updated successfully!');
      } else {
        await axios.post(
          'http://localhost:5000/api/advertisements',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Advertisement created successfully!');
      }

      resetForm();
      fetchAdvertisements();
    } catch (error) {
      console.error('Error saving advertisement:', error);
      alert(error.response?.data?.error || 'Failed to save advertisement');
    }
  };

  const handleEdit = (ad) => {
    setEditingId(ad.id);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      linkUrl: ad.linkUrl || '',
      linkText: ad.linkText || '',
      startDate: ad.startDate,
      endDate: ad.endDate,
      displayOrder: ad.displayOrder,
      image: null
    });
    if (ad.imageUrl) {
      setImagePreview(`http://localhost:5000${ad.imageUrl}`);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/advertisements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Advertisement deleted successfully!');
      fetchAdvertisements();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      alert('Failed to delete advertisement');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/advertisements/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdvertisements();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      linkUrl: '',
      linkText: '',
      startDate: '',
      endDate: '',
      displayOrder: 0,
      image: null
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadge = (ad) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    if (!ad.isActive) {
      return <span className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-200 rounded-full">Inactive</span>;
    }
    if (now < start) {
      return <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">Scheduled</span>;
    }
    if (now > end) {
      return <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">Expired</span>;
    }
    return <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-500 fas fa-spinner fa-spin"></i>
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
            <h1 className="text-3xl font-bold text-gray-800">Advertisement Management</h1>
            <p className="text-gray-600">Manage seasonal offers and promotions displayed on homepage</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg shadow-lg transition hover:bg-orange-600"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'New Advertisement'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              <i className="mr-2 fas fa-ad"></i>
              {editingId ? 'Edit Advertisement' : 'Create New Advertisement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Summer Special 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0 = highest priority"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Link URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/tour"
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    name="linkText"
                    value={formData.linkText}
                    onChange={handleInputChange}
                    placeholder="Book Now, Learn More, etc."
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter advertisement description..."
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Advertisement Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover h-32 rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg transition hover:bg-orange-600"
                >
                  <i className="mr-2 fas fa-save"></i>
                  {editingId ? 'Update Advertisement' : 'Create Advertisement'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  <i className="mr-2 fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Advertisements List */}
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-500 to-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Advertisement
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advertisements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <i className="mb-4 text-6xl text-gray-300 fas fa-ad"></i>
                      <h3 className="mb-2 text-xl font-semibold text-gray-800">No Advertisements Found</h3>
                      <p className="text-sm">Create your first advertisement to get started!</p>
                    </td>
                  </tr>
                ) : (
                  advertisements.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {ad.imageUrl && (
                            <img
                              src={`http://localhost:5000${ad.imageUrl}`}
                              alt={ad.title}
                              className="object-cover mr-4 w-32 h-20 rounded-lg shadow-md"
                            />
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{ad.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">{ad.description}</div>
                            {ad.linkUrl && (
                              <div className="flex gap-1 items-center mt-1 text-xs text-orange-600">
                                <LinkIcon size={12} />
                                {ad.linkText || 'Link'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 items-center text-sm text-gray-600">
                          <Calendar size={16} />
                          <div>
                            <div className="font-medium">{new Date(ad.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">to {new Date(ad.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ad)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-4 items-center text-sm text-gray-600">
                          <div className="flex gap-1 items-center">
                            <Eye size={16} className="text-blue-500" />
                            <span className="font-medium">{ad.viewCount || 0}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="font-medium">{ad.clickCount || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-x-3 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(ad.id)}
                          className={`${
                            ad.isActive ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={ad.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`fas ${ad.isActive ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                        <button
                          onClick={() => handleEdit(ad)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Advertisements;