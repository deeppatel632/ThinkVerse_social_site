import api from './axios';

export const messagesAPI = {
  // Get all conversations for the current user
  getConversations: async () => {
    const response = await api.get('/api/messages/conversations/');
    return response.data;
  },

  // Start a new conversation with a user
  startConversation: async (username) => {
    const response = await api.post(`/api/messages/start/${username}/`);
    return response.data;
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/api/messages/conversation/${conversationId}/messages/`);
    return response.data;
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, content) => {
    const response = await api.post(`/api/messages/conversation/${conversationId}/send/`, {
      content
    });
    return response.data;
  },
};
