import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,  Edit2,  Star,  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  ChevronRight,
  ChevronDown,
  Copy,
  RefreshCw,
  Tag,
  User,
  Search,
  Package,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  Hotel,
  FileText,
  Settings,
  MoreVertical,
  Grid,
  List,
  Filter,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const ManagePackage = () => {
    const navigate = useNavigate();
    
    // Package listing state
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [expandedPackage, setExpandedPackage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedPackages, setSelectedPackages] = useState([]);
    
    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editingLoading, setEditingLoading] = useState(false);

    // Category colors
    const categoryColors = {
        silver: 'bg-gray-100 text-gray-800 border border-gray-300',
        gold: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200',
        platinum: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-300',
        customized: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border border-purple-200'
    };

    // Status colors and icons
    const statusConfig = {
        draft: { color: 'bg-gray-100 text-gray-800', icon: '✏️', badge: 'bg-gray-200 text-gray-800' },
        published: { color: 'bg-green-100 text-green-800', icon: '✅', badge: 'bg-green-200 text-green-800' },
        suspended: { color: 'bg-red-100 text-red-800', icon: '⏸️', badge: 'bg-red-200 text-red-800' },
        archived: { color: 'bg-gray-100 text-gray-600', icon: '📁', badge: 'bg-gray-200 text-gray-700' }
    };

    // Fetch packages on component mount
    useEffect(() => {
        fetchPackages();
    }, []);

    // Fetch packages from API
    const fetchPackages = async () => {
        setLoadingPackages(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/packages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setPackages(response.data.packages || []);
            } else {
                setError('Failed to fetch packages: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            setError('Failed to load packages. Please try again.');
            setPackages([]);
        } finally {
            setLoadingPackages(false);
        }
    };

    // Filter packages
    const filteredPackages = packages.filter(pkg => {
        const name = pkg.package_name?.toLowerCase() || '';
        const code = pkg.package_code?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            name.includes(search) || code.includes(search);

        const matchesCategory =
            categoryFilter === 'all' || pkg.category === categoryFilter;

        const matchesStatus =
            statusFilter === 'all' || pkg.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Toggle package selection
    const togglePackageSelection = (packageId) => {
        setSelectedPackages(prev =>
            prev.includes(packageId)
                ? prev.filter(id => id !== packageId)
                : [...prev, packageId]
        );
    };

    // Select all packages
    const selectAllPackages = () => {
        if (selectedPackages.length === filteredPackages.length) {
            setSelectedPackages([]);
        } else {
            setSelectedPackages(filteredPackages.map(pkg => pkg.id));
        }
    };

    // Navigate to create package page
    const navigateToCreatePackage = () => {
        navigate('/manager/packages/create');
    };

    // Navigate to edit package page
    const navigateToEditPackage = (packageId) => {
        navigate(`/manager/packages/edit/${packageId}`);
    };

    // Open edit modal with package details
    const openEditModal = async (pkg) => {
        setEditingLoading(true);
        try {
            // Set the editing package and form data with current package details
            setEditingPackage(pkg);
            setEditFormData({
                package_name: pkg.package_name || '',
                package_code: pkg.package_code || '',
                description: pkg.description || '',
                category: pkg.category || '',
                duration_days: pkg.duration_days || '',
                duration_nights: pkg.duration_nights || '',
                min_travelers: pkg.min_travelers || '',
                max_travelers: pkg.max_travelers || '',
                min_price: pkg.min_price || '',
                max_price: pkg.max_price || '',
                hotel_stars: pkg.hotel_stars || '',
                valid_from: pkg.valid_from ? pkg.valid_from.split('T')[0] : '',
                valid_to: pkg.valid_to ? pkg.valid_to.split('T')[0] : '',
                status: pkg.status || 'draft'
            });
            setShowEditModal(true);
        } catch (error) {
            console.error('Error loading package for edit:', error);
            setError('Failed to load package details');
        } finally {
            setEditingLoading(false);
        }
    };

    // Close edit modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingPackage(null);
        setEditFormData({});
    };

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save edited package
    const saveEditedPackage = async () => {
        if (!editingPackage) return;
        
        try {
            setEditingLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_BASE_URL}/packages/${editingPackage.id}`,
                editFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Package updated successfully!');
                closeEditModal();
                fetchPackages();
            } else {
                setError('Failed to update package: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating package:', error);
            setError('Failed to update package. Please try again.');
        } finally {
            setEditingLoading(false);
        }
    };

    // Navigate to view package details
    const navigateToViewPackage = (packageId) => {
        navigate(`/package/${packageId}`);
    };

    // Duplicate package
    const handleDuplicatePackage = async (pkg) => {
        if (window.confirm(`Are you sure you want to duplicate "${pkg.package_name}"?`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`${API_BASE_URL}/packages/duplicate`, {
                    package_id: pkg.id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setSuccess(`Package duplicated successfully!`);
                    fetchPackages();
                } else {
                    setError('Failed to duplicate package: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error duplicating package:', error);
                setError('Failed to duplicate package. Please try again.');
            }
        }
    };

    // Update package status
    const updatePackageStatus = async (packageId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/packages/${packageId}/status`, {
                status: newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSuccess(`Package status updated to ${newStatus}`);
                fetchPackages();
            } else {
                setError('Failed to update status: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating package status:', error);
            setError('Failed to update status. Please try again.');
        }
    };

    // Delete package
    const handleDeletePackage = async (pkg) => {
        if (window.confirm(`Are you sure you want to delete "${pkg.package_name}"? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${API_BASE_URL}/packages/${pkg.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setSuccess(`Package "${pkg.package_name}" deleted successfully!`);
                    fetchPackages();
                } else {
                    setError('Failed to delete package: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error deleting package:', error);
                setError('Failed to delete package. Please try again.');
            }
        }
    };

    // Delete selected packages
    const deleteSelectedPackages = async () => {
        if (selectedPackages.length === 0) {
            alert('Please select packages to delete');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedPackages.length} selected package(s)?`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`${API_BASE_URL}/packages/bulk-delete`, {
                    package_ids: selectedPackages
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setSuccess(`Successfully deleted ${selectedPackages.length} package(s)`);
                    setSelectedPackages([]);
                    fetchPackages();
                } else {
                    setError('Failed to delete packages: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error deleting packages:', error);
                setError('Failed to delete packages. Please try again.');
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate price per day
    const calculatePricePerDay = (price, days) => {
        if (!price || !days || days === 0) return '$0';
        const perDay = price / days;
        return `$${Math.round(perDay)}/day`;
    };

    // Get category label
    const getCategoryLabel = (category) => {
        const labels = {
            silver: 'Silver',
            gold: 'Gold',
            platinum: 'Platinum',
            customized: 'Customized'
        };
        return labels[category] || category;
    };

    // Get status label
    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Draft',
            published: 'Published',
            suspended: 'Suspended',
            archived: 'Archived'
        };
        return labels[status] || status;
    };

    // Dashboard sidebar items
    const sidebarItems = [
        { icon: <Package className="w-5 h-5" />, label: 'Packages', path: '/ManagePackage' },
        { icon: <MapPin className="w-5 h-5" />, label: 'Destinations', path: '/manager/destinations' },
        { icon: <Hotel className="w-5 h-5" />, label: 'Hotels', path: '/manager/hotels' },
        { icon: <Users className="w-5 h-5" />, label: 'Bookings', path: '/manager/bookings' },
        { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/manager/reports' },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/manager/settings' },
    ];

    // Stats
    const stats = {
        total: packages.length,
        published: packages.filter(p => p.status === 'published').length,
        draft: packages.filter(p => p.status === 'draft').length,
        revenue: packages.reduce((sum, pkg) => sum + (pkg.max_price || 0), 0)
    };

    return (
        <DashboardLayout 
            sidebarItems={sidebarItems}
            userRole="manager"
            userName="John Manager"
            userEmail="manager@ceylontourmate.com"
        >
            <div className="p-4 min-h-screen bg-gray-50 md:p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 justify-between items-start mb-6 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Tour Packages</h1>
                                <p className="mt-1 text-gray-600">Manage and organize your tour packages</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={navigateToCreatePackage}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Package
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Packages</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-green-700">{stats.published}</p>
                                    </div>
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Drafts</p>
                                        <p className="text-2xl font-bold text-yellow-700">{stats.draft}</p>
                                    </div>
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <Edit2 className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Value</p>
                                        <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.revenue)}</p>
                                    </div>
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="p-4 mb-6 bg-red-50 rounded-xl border border-red-200 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center text-red-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <p className="font-medium">{error}</p>
                                </div>
                                <button onClick={() => setError('')}>
                                    <X className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 mb-6 bg-green-50 rounded-xl border border-green-200 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center text-green-800">
                                    <Check className="w-5 h-5" />
                                    <p className="font-medium">{success}</p>
                                </div>
                                <button onClick={() => setSuccess('')}>
                                    <X className="w-4 h-4 text-green-600" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search and Filters Bar */}
                    <div className="p-4 mb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
                            <div className="w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Search packages..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 items-center">
                                <div className="flex gap-2 items-center">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="silver">Silver</option>
                                        <option value="gold">Gold</option>
                                        <option value="platinum">Platinum</option>
                                        <option value="customized">Customized</option>
                                    </select>
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="archived">Archived</option>
                                </select>

                                <div className="flex overflow-hidden rounded-lg border border-gray-300">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={fetchPackages}
                                    className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                                    title="Refresh"
                                >
                                    <RefreshCw className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedPackages.length > 0 && (
                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                                <div className="flex gap-3 items-center">
                                    <span className="text-sm text-gray-700">
                                        {selectedPackages.length} package(s) selected
                                    </span>
                                    <button
                                        onClick={deleteSelectedPackages}
                                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Selected
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedPackages([])}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Packages Grid/List View */}
                    {loadingPackages ? (
                        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="inline-block mb-4 w-10 h-10 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                            <p className="text-gray-600">Loading packages...</p>
                        </div>
                    ) : filteredPackages.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                            <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-600">No packages found</h3>
                            <p className="mb-6 text-gray-500">
                                {searchTerm ? 'Try adjusting your search or filters' : 'Get started by creating your first package'}
                            </p>
                            <button
                                onClick={navigateToCreatePackage}
                                className="flex gap-2 items-center px-6 py-3 mx-auto text-white bg-blue-600 rounded-lg shadow-sm transition-colors hover:bg-blue-700 hover:shadow"
                            >
                                <Plus className="w-5 h-5" />
                                Create New Package
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPackages.map((pkg) => (
                                <div key={pkg.id} className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                                    {/* Package Header */}
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {pkg.package_name}
                                                </h3>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <span className="flex gap-1 items-center text-sm text-gray-500">
                                                        <Tag className="w-3 h-3" />
                                                        {pkg.package_code}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[pkg.status]?.badge || 'bg-gray-200 text-gray-800'}`}>
                                                        {statusConfig[pkg.status]?.icon} {getStatusLabel(pkg.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPackages.includes(pkg.id)}
                                                    onChange={() => togglePackageSelection(pkg.id)}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <button className="p-1 rounded hover:bg-gray-100">
                                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 items-center">
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-800'}`}>
                                                {getCategoryLabel(pkg.category)}
                                            </span>
                                            <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                                {pkg.hotel_stars}★ Hotels
                                            </span>
                                        </div>
                                    </div>

                                    {/* Package Details */}
                                    <div className="p-5">
                                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                                            {pkg.description || 'No description provided'}
                                        </p>
                                        
                                        <div className="mb-4 space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex gap-1 items-center text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    Duration
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {pkg.duration_days} days • {pkg.duration_nights} nights
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex gap-1 items-center text-gray-500">
                                                    <Users className="w-4 h-4" />
                                                    Group Size
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {pkg.min_travelers}-{pkg.max_travelers} travelers
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex gap-1 items-center text-gray-500">
                                                    <DollarSign className="w-4 h-4" />
                                                    Price Range
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(pkg.max_price)} - {formatCurrency(pkg.min_price)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Valid: {formatDate(pkg.valid_from)} → {formatDate(pkg.valid_to)}
                                        </div>
                                    </div>

                                    {/* Package Footer */}
                                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Per day: </span>
                                                <span className="font-medium text-gray-900">
                                                    {calculatePricePerDay(pkg.max_price, pkg.duration_days)}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    onClick={() => openEditModal(pkg)}
                                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors shadow-sm hover:shadow"
                                                    title="Edit package details"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicatePackage(pkg)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-lg"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPackages.length === filteredPackages.length && filteredPackages.length > 0}
                                                    onChange={selectAllPackages}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Package
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Duration
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Price Range
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPackages.map((pkg) => (
                                            <tr key={pkg.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPackages.includes(pkg.id)}
                                                        onChange={() => togglePackageSelection(pkg.id)}
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-blue-100 rounded-lg">
                                                            <Package className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {pkg.package_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {pkg.package_code}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-800'}`}>
                                                        {getCategoryLabel(pkg.category)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{pkg.duration_days} days</div>
                                                    <div className="text-sm text-gray-500">{pkg.duration_nights} nights</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(pkg.max_price)} - {formatCurrency(pkg.min_price)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {calculatePricePerDay(pkg.max_price, pkg.duration_days)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs ${statusConfig[pkg.status]?.badge || 'bg-gray-200 text-gray-800'}`}>
                                                        {statusConfig[pkg.status]?.icon} {getStatusLabel(pkg.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => openEditModal(pkg)}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors shadow-sm hover:shadow"
                                                            title="Edit package details"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicatePackage(pkg)}
                                                            className="p-1.5 hover:bg-gray-200 rounded-lg"
                                                            title="Duplicate"
                                                        >
                                                            <Copy className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePackage(pkg)}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Results Count and Pagination */}
                    {!loadingPackages && filteredPackages.length > 0 && (
                        <div className="flex flex-col gap-4 justify-between items-center mt-6 sm:flex-row">
                            <p className="text-sm text-gray-600">
                                Showing {filteredPackages.length} of {packages.length} packages
                            </p>
                            
                            <div className="flex gap-2 items-center">
                                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    <Share2 className="inline mr-1 w-4 h-4" />
                                    Export
                                </button>
                                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    <BarChart3 className="inline mr-1 w-4 h-4" />
                                    Analytics
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Package Modal */}
            {showEditModal && editingPackage && (
                <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex sticky top-0 justify-between items-center p-6 bg-white border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Edit Package</h2>
                                <p className="mt-1 text-sm text-gray-500">Review and modify package details</p>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                                disabled={editingLoading}
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Package Basic Info */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Package Name
                                    </label>
                                    <input
                                        type="text"
                                        name="package_name"
                                        value={editFormData.package_name}
                                        onChange={handleEditFormChange}
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Package Code
                                    </label>
                                    <input
                                        type="text"
                                        name="package_code"
                                        value={editFormData.package_code}
                                        onChange={handleEditFormChange}
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    rows="4"
                                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category and Hotel Stars */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditFormChange}
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="silver">Silver</option>
                                        <option value="gold">Gold</option>
                                        <option value="platinum">Platinum</option>
                                        <option value="customized">Customized</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Hotel Stars
                                    </label>
                                    <input
                                        type="number"
                                        name="hotel_stars"
                                        value={editFormData.hotel_stars}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        max="5"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Duration (Days)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration_days"
                                        value={editFormData.duration_days}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Duration (Nights)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration_nights"
                                        value={editFormData.duration_nights}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Travelers */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Min Travelers
                                    </label>
                                    <input
                                        type="number"
                                        name="min_travelers"
                                        value={editFormData.min_travelers}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Max Travelers
                                    </label>
                                    <input
                                        type="number"
                                        name="max_travelers"
                                        value={editFormData.max_travelers}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Min Price
                                    </label>
                                    <input
                                        type="number"
                                        name="min_price"
                                        value={editFormData.min_price}
                                        onChange={handleEditFormChange}
                                        min="0"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Max Price
                                    </label>
                                    <input
                                        type="number"
                                        name="max_price"
                                        value={editFormData.max_price}
                                        onChange={handleEditFormChange}
                                        min="0"
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Valid Dates */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Valid From
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        value={editFormData.valid_from}
                                        onChange={handleEditFormChange}
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Valid To
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        value={editFormData.valid_to}
                                        onChange={handleEditFormChange}
                                        className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleEditFormChange}
                                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={closeEditModal}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                disabled={editingLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditedPackage}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={editingLoading}
                            >
                                {editingLoading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom CSS for animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default ManagePackage;