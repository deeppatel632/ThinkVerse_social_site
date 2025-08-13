import api from './axios';

export const commentsAPI = {
  // Get comments for a blog
  getComments: async (blogId, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page,
      limit,
    });
    const response = await api.get(`/api/blogs/${blogId}/comments/?${params}`);
    return response.data;
  },

  // Create new comment
  createComment: async (blogId, commentData) => {
    const response = await api.post(`/api/blogs/${blogId}/comments/`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/api/comments/${commentId}/`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/api/comments/${commentId}/`);
    return response.data;
  },

  // Like/unlike comment
  toggleLike: async (commentId) => {
    const response = await api.post(`/api/comments/${commentId}/like/`);
    return response.data;
  },

  // Reply to comment
  replyToComment: async (commentId, replyData) => {
    const response = await api.post(`/api/comments/${commentId}/replies/`, replyData);
    return response.data;
  },

  // Get comment replies
  getReplies: async (commentId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page,
      limit,
    });
    const response = await api.get(`/api/comments/${commentId}/replies/?${params}`);
    return response.data;
  },

  // Get user's comments
  getUserComments: async (userId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page,
      limit,
    });
    const response = await api.get(`/api/comments/user/${userId}/?${params}`);
    return response.data;
  },
}; 