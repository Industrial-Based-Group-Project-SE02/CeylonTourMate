import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, TrendingUp, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import API_BASE_URL, { getImageUrl } from '../config/api';

function Advertisements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
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

  // Validation errors
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/advertisements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvertisements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching advertisements:', err);
      setError('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        errors.endDate = 'End date must be after start date';
      }
    }

    if (formData.linkUrl && !isValidUrl(formData.linkUrl)) {
      errors.linkUrl = 'Please enter a valid URL';
    }

    if (formData.linkUrl && !formData.linkText) {
      errors.linkText = 'Link text is required when URL is provided';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'File size must be less than 10MB' }));
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, image: 'Only JPEG, PNG, GIF, and WebP formats are allowed' }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
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
          `${API_BASE_URL}/api/advertisements/${editingId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Advertisement updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/api/advertisements`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Advertisement created successfully!');
      }

      setTimeout(() => setSuccess(null), 4000);
      resetForm();
      setCurrentPage(1);
      fetchAdvertisements();
    } catch (err) {
      console.error('Error saving advertisement:', err);
      setError(err.response?.data?.error || 'Failed to save advertisement');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ad) => {
    setEditingId(ad.id);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      linkUrl: ad.linkUrl || '',
      linkText: ad.linkText || '',
      startDate: ad.startDate.split('T')[0],
      endDate: ad.endDate.split('T')[0],
      displayOrder: ad.displayOrder,
      image: null
    });
    if (ad.imageUrl) {
      setImagePreview(getImageUrl(ad.imageUrl));
    }
    setFormErrors({});
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/advertisements/${deleteTargetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Advertisement deleted successfully!');
      setTimeout(() => setSuccess(null), 4000);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setCurrentPage(1);
      fetchAdvertisements();
    } catch (err) {
      console.error('Error deleting advertisement:', err);
      setError('Failed to delete advertisement');
      setTimeout(() => setError(null), 4000);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/advertisements/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(currentStatus ? 'Advertisement deactivated!' : 'Advertisement activated!');
      setTimeout(() => setSuccess(null), 4000);
      fetchAdvertisements();
    } catch (err) {
      console.error('Error toggling status:', err);
      setError('Failed to update advertisement status');
      setTimeout(() => setError(null), 4000);
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
    setFormErrors({});
  };

  const getStatusBadge = (ad) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    if (!ad.isActive) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    if (now < start) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (now > end) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusLabel = (ad) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);

    if (!ad.isActive) return 'Inactive';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Notifications */}
        {error && (
          <div className="flex gap-3 items-center p-4 mb-6 bg-red-50 rounded-lg border-l-4 border-red-500 animate-fadeIn">
            <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
            <span className="flex-1 font-medium text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="flex gap-3 items-center p-4 mb-6 bg-green-50 rounded-lg border-l-4 border-green-500 animate-fadeIn">
            <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
            <span className="flex-1 font-medium text-green-800">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="flex gap-3 items-center mb-2 text-4xl font-bold text-gray-900">
            <div className="p-2 bg-orange-600 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            Advertisement Management
          </h1>
          <p className="text-gray-600">Create and manage promotional advertisements displayed on the homepage</p>
        </div>

        {/* Form Section */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (!showForm) {
                resetForm();
                setShowForm(true);
              } else {
                resetForm();
              }
            }}
            className="inline-flex gap-2 items-center px-6 py-3 mb-4 font-semibold text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'New Advertisement'}
          </button>

          {showForm && (
            <div className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Special 2025"
                    className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                {/* Grid for dates and order */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.startDate && <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>}
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
                      className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.endDate && <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>}
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
                      placeholder="0 = highest priority"
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Description */}
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
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Link Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Link URL
                    </label>
                    <input
                      type="url"
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/tour"
                      className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.linkUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.linkUrl && <p className="mt-1 text-sm text-red-600">{formErrors.linkUrl}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Link Text
                    </label>
                    <input
                      type="text"
                      name="linkText"
                      value={formData.linkText}
                      onChange={handleInputChange}
                      placeholder="Book Now, Learn More, etc."
                      className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.linkText ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.linkText && <p className="mt-1 text-sm text-red-600">{formErrors.linkText}</p>}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Advertisement Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`px-4 py-2 w-full rounded-lg border transition outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-600">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover h-40 rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {editingId ? 'Update Advertisement' : 'Create Advertisement'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Advertisements List */}
        <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white bg-gradient-to-r from-orange-600 to-orange-700">
                  <th className="px-6 py-4 text-sm font-semibold text-left">Advertisement</th>
                  <th className="px-6 py-4 text-sm font-semibold text-left">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold text-left">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-center">Stats</th>
                  <th className="px-6 py-4 text-sm font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {advertisements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <TrendingUp className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">No Advertisements</h3>
                      <p className="text-gray-600">Create your first advertisement to get started</p>
                    </td>
                  </tr>
                ) : (
                  advertisements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((ad, index) => (
                    <tr key={ad.id} className={`transition hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex gap-4 items-start">
                          {ad.imageUrl && (
                            <img
                              src={getImageUrl(ad.imageUrl)}
                              alt={ad.title}
                              className="object-cover flex-shrink-0 w-20 h-20 rounded-lg shadow-sm"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">{ad.title}</p>
                            {ad.description && (
                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ad.description}</p>
                            )}
                            {ad.linkUrl && (
                              <div className="flex gap-1 items-center mt-1 text-xs text-orange-600">
                                <LinkIcon className="w-3 h-3" />
                                <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {ad.linkText || 'Visit'}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{new Date(ad.startDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">to {new Date(ad.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(ad)}`}>
                          {getStatusLabel(ad)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-4 justify-center items-center text-sm">
                          <div className="flex gap-1 items-center">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-700">{ad.viewCount || 0}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-gray-700">{ad.clickCount || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleToggleStatus(ad.id, ad.isActive)}
                            className={`p-2 rounded-lg transition ${
                              ad.isActive
                                ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={ad.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {ad.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(ad)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ad.id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {advertisements.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(currentPage * itemsPerPage, advertisements.length)}</span> of{' '}
                <span className="font-semibold">{advertisements.length}</span> advertisements
              </p>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1 items-center">
                  {Array.from({ length: Math.ceil(advertisements.length / itemsPerPage) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                          currentPage === pageNum
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(advertisements.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(advertisements.length / itemsPerPage)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-8">
                <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">Delete Advertisement?</h2>
                <p className="mb-6 text-center text-gray-600">
                  This action cannot be undone. The advertisement will be permanently deleted.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex flex-1 gap-2 justify-center items-center px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTargetId(null);
                    }}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Advertisements;