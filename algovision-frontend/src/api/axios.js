import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true, // Important for Django session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get CSRF token from backend
const getCSRFToken = async () => {
  try {
    const response = await api.get('/api/users/csrf/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Get CSRF token from cookie first, then from backend if not available
    let csrfToken = getCookie('csrftoken');
    
    if (!csrfToken) {
      csrfToken = await getCSRFToken();
    }
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default api; 