// API Configuration
// This file handles the API base URL for both development and production

// For Vite: Use import.meta.env (not process.env)
// For React: Use import.meta.env.VITE_* variables
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.origin) ||
  'http://localhost:5000';

export const getApiUrl = () => {
  return API_BASE_URL;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${imagePath}`;
};

export default API_BASE_URL;
