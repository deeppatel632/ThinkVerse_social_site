import api from './axios';

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/users/auth/register/', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/users/auth/login/', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/users/auth/logout/');
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get('/api/users/auth/check/');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const response = await api.get('/api/users/auth/check/');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/auth/profile/', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/api/users/auth/change-password/', passwordData);
    return response.data;
  },
}; 