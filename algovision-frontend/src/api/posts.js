import api from './axios';

export const postsAPI = {
  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/api/blogs/create/', postData);
    return response.data;
  },

  // Get all posts for timeline
  getPosts: async () => {
    const response = await api.get('/api/blogs/posts/');
    return response.data;
  },

  // Get a single post by ID
  getPost: async (postId) => {
    const response = await api.get(`/api/blogs/${postId}/`);
    return response.data;
  },

  // Get user's posts for profile
  getUserPosts: async (userId) => {
    const response = await api.get(`/api/blogs/user/${userId}/posts/`);
    return response.data;
  },

  // Like/Unlike a post
  toggleLike: async (postId) => {
    const response = await api.post(`/api/blogs/${postId}/like/`);
    return response.data;
  },

  // Get replies for a post
  getPostReplies: async (postId) => {
    const response = await api.get(`/api/blogs/${postId}/replies/`);
    return response.data;
  },

  // Create a reply to a post
  createReply: async (postId, content) => {
    const response = await api.post('/api/blogs/create/', {
      content,
      is_reply: true,
      parent_post_id: postId
    });
    return response.data;
  },

  // Save/Unsave a post
  toggleSave: async (postId) => {
    const response = await api.post(`/api/blogs/${postId}/save/`);
    return response.data;
  },

  // Get user's saved posts
  getSavedPosts: async () => {
    const response = await api.get('/api/blogs/saved/');
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
};
