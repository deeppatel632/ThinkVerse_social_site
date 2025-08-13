import api from './axios';

export const usersAPI = {
  // Get user profile by username
  getUserProfile: async (username) => {
    const response = await api.get(`/api/users/profile/${username}/`);
    return response.data;
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const response = await api.get('/api/users/profile/');
    return response.data;
  },

  // Follow a user
  followUser: async (username) => {
    const response = await api.post(`/api/users/follow/${username}/`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (username) => {
    const response = await api.post(`/api/users/unfollow/${username}/`);
    return response.data;
  },

  // Toggle follow/unfollow (enhanced functionality)
  toggleFollow: async (username) => {
    const response = await api.post(`/api/users/toggle-follow/${username}/`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile/update/', profileData);
    return response.data;
  },

  // Search users
  searchUsers: async (query, page = 1, limit = 20) => {
    const response = await api.get('/api/users/search/', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get followers list
  getFollowers: async (username, page = 1, limit = 20) => {
    const response = await api.get(`/api/users/${username}/followers/`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get following list
  getFollowing: async (username, page = 1, limit = 20) => {
    const response = await api.get(`/api/users/${username}/following/`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get suggested users
  getSuggestedUsers: async (limit = 10) => {
    const response = await api.get('/api/users/suggestions/', {
      params: { limit }
    });
    return response.data;
  },

  // Block user
  blockUser: async (username) => {
    const response = await api.post(`/api/users/block/${username}/`);
    return response.data;
  },

  // Unblock user
  unblockUser: async (username) => {
    const response = await api.post(`/api/users/unblock/${username}/`);
    return response.data;
  },

  // Get user activity
  getUserActivity: async (page = 1, limit = 20) => {
    const response = await api.get('/api/users/activity/', {
      params: { page, limit }
    });
    return response.data;
  },
};
