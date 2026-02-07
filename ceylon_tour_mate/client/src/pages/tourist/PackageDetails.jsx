import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/packages/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch package details');
      }
      
      const data = await response.json();
      setPackageData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching package details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-4 text-xl text-red-500">Error: {error}</div>
        <button
          onClick={() => navigate('/tourist/packages')}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-4 text-xl text-gray-500">Package not found</div>
        <button
          onClick={() => navigate('/tourist/packages')}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/tourist/packages')}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <i className="mr-2 fas fa-arrow-left"></i>
          Back to Packages
        </button>

        {/* Package Card */}
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          {/* Package Header */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-blue-600">
            <h1 className="mb-2 text-3xl font-bold">{packageData.name}</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <i className="mr-2 fas fa-map-marker-alt"></i>
                  {packageData.destination}
                </span>
                <span className="flex items-center">
                  <i className="mr-2 fas fa-clock"></i>
                  {packageData.duration}
                </span>
              </div>
              <div className="text-3xl font-bold">
                ${packageData.price}
              </div>
            </div>
          </div>

          {/* Package Content */}
          <div className="p-6">
            {/* Status Badge */}
            {packageData.status && (
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  packageData.status === 'Popular' ? 'bg-yellow-100 text-yellow-800' :
                  packageData.status === 'Luxury' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {packageData.status}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">Description</h2>
              <p className="leading-relaxed text-gray-600">
                {packageData.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {packageData.features && packageData.features.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-gray-800">Package Features</h2>
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {packageData.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="mt-1 mr-2 text-green-500 fas fa-check-circle"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
              {packageData.category && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-1 text-sm text-gray-500">Category</div>
                  <div className="font-semibold text-gray-800 capitalize">
                    {packageData.category}
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-1 text-sm text-gray-500">Duration</div>
                <div className="font-semibold text-gray-800">
                  {packageData.duration}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-1 text-sm text-gray-500">Price</div>
                <div className="font-semibold text-gray-800">
                  ${packageData.price}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex pt-6 space-x-4 border-t">
              <button
                onClick={() => navigate(`/tourist/booking/${packageData.id}`)}
                className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                <i className="mr-2 fas fa-calendar-check"></i>
                Book Now
              </button>
              <button
                onClick={() => navigate('/tourist/packages')}
                className="px-6 py-3 font-semibold text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
              >
                Browse More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
