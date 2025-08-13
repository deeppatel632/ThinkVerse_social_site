import api from './axios';

export const blogAPI = {
  // Get all blogs with pagination
  getBlogs: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });
    const response = await api.get(`/api/blogs/?${params}`);
    return response.data;
  },

  // Get single blog by ID
  getBlog: async (id) => {
    const response = await api.get(`/api/blogs/${id}/`);
    return response.data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const response = await api.post('/api/blogs/', blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/api/blogs/${id}/`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/api/blogs/${id}/`);
    return response.data;
  },

  // Like/unlike blog
  toggleLike: async (id) => {
    const response = await api.post(`/api/blogs/${id}/like/`);
    return response.data;
  },

  // Get blogs by tag
  getBlogsByTag: async (tag, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page,
      limit,
    });
    const response = await api.get(`/api/blogs/tag/${tag}/?${params}`);
    return response.data;
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 10) => {
    const response = await api.get(`/api/blogs/trending/?limit=${limit}`);
    return response.data;
  },

  // Get user's blogs
  getUserBlogs: async (userId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page,
      limit,
    });
    const response = await api.get(`/api/blogs/user/${userId}/?${params}`);
    return response.data;
  },

  // Get user's liked posts
  getUserLikedPosts: async (username) => {
    const response = await api.get(`/api/blogs/user/${username}/likes/`);
    return response.data;
  },

  // Get user's replies
  getUserReplies: async (username) => {
    const response = await api.get(`/api/blogs/user/${username}/replies/`);
    return response.data;
  },

  // Get user's media posts
  getUserMediaPosts: async (username) => {
    const response = await api.get(`/api/blogs/user/${username}/media/`);
    return response.data;
  },

  // Get saved posts
  getSavedPosts: async () => {
    const response = await api.get('/api/blogs/saved/');
    return response.data;
  },

  // Save/unsave post
  toggleSave: async (id) => {
    const response = await api.post(`/api/blogs/${id}/save/`);
    return response.data;
  },

  // Upload blog image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/blogs/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 