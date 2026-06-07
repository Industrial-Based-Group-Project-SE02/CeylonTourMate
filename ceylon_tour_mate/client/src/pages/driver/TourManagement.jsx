import React, { useState, useEffect } from 'react';

const TourManagement = () => {
    const userId = 1; // Temporary ID - should come from AuthContext later
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTourId, setCurrentTourId] = useState(null);

    const [formData, setFormData] = useState({
        destination: '',
        start_date: '',
        end_date: '',
        status: 'Pending',
        description: ''
    });

    const fetchTours = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/tours/${userId}`);
            const data = await response.json();
            setTours(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchTours(); }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ destination: '', start_date: '', end_date: '', status: 'Pending', description: '' });
        setShowForm(false);
        setIsEditing(false);
        setCurrentTourId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing 
            ? `http://localhost:5000/api/tours/${currentTourId}` 
            : `http://localhost:5000/api/tours`;
        
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ? formData : { ...formData, user_id: userId };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                resetForm();
                fetchTours();
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    const handleEdit = (tour) => {
        setFormData({
            destination: tour.destination,
            start_date: tour.start_date.split('T')[0], // Format date for input
            end_date: tour.end_date.split('T')[0],
            status: tour.status,
            description: tour.description || ''
        });
        setCurrentTourId(tour.tour_id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this trip?")) {
            await fetch(`http://localhost:5000/api/tours/${id}`, { method: 'DELETE' });
            fetchTours();
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">Trip Management</h1>
                <button 
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className={`${showForm ? 'bg-gray-500' : 'bg-blue-600'} text-white px-4 py-2 rounded shadow hover:opacity-90 transition`}
                >
                    {showForm ? 'Cancel' : '+ Add New Trip'}
                </button>
            </div>

            {/* TOGGLEABLE FORM */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-600">
                    <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Trip Details' : 'Enter New Trip Details'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Destination</label>
                            <input name="destination" required value={formData.destination} onChange={handleInputChange} className="border p-2 rounded" placeholder="e.g. Kandy" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded">
                                <option value="Pending">Pending</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Start Date</label>
                            <input name="start_date" type="date" required value={formData.start_date} onChange={handleInputChange} className="border p-2 rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">End Date</label>
                            <input name="end_date" type="date" required value={formData.end_date} onChange={handleInputChange} className="border p-2 rounded" />
                        </div>
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="border p-2 rounded" rows="2" placeholder="Notes about the trip..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 w-full md:w-auto">
                                {isEditing ? 'Update Trip' : 'Save Trip'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DATA TABLE */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-bold uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tours.length > 0 ? tours.map((tour) => (
                            <tr key={tour.tour_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{tour.destination}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(tour.start_date).toLocaleDateString()} to {new Date(tour.end_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        tour.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                        tour.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {tour.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleEdit(tour)} className="text-blue-600 hover:underline mr-4 font-bold">Edit</button>
                                    <button onClick={() => handleDelete(tour.tour_id)} className="text-red-600 hover:underline font-bold">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="p-10 text-center text-gray-500">No trips listed yet. Click "Add New Trip" to begin.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TourManagement;