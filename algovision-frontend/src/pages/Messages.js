import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { messagesAPI } from '../api/messages';
import { usersAPI } from '../api/users';
import { MessageCircle, Send, ArrowLeft, Edit, Search, X, Check } from 'lucide-react';

const Messages = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // New state for enhanced messaging
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle navigation from profile page
  useEffect(() => {
    const handleProfileNavigation = async () => {
      if (location.state?.conversationId && location.state?.user) {
        const { conversationId, user } = location.state;
        
        // Wait for conversations to load first
        if (conversations.length > 0) {
          const existingConversation = conversations.find(conv => conv.id === conversationId);
          
          if (existingConversation) {
            setSelectedConversation(existingConversation);
            // Load messages for this conversation
            try {
              const response = await messagesAPI.getMessages(conversationId);
              setMessages(response.messages || []);
            } catch (error) {
              console.error('Error loading messages:', error);
            }
          } else {
            // Create a temporary conversation object for new conversations
            const tempConversation = {
              id: conversationId,
              other_participant: {
                id: user.id,
                username: user.username,
                full_name: user.full_name || user.username,
                avatar: user.avatar_image || null
              },
              last_message: null,
              unread_count: 0
            };
            
            setConversations(prev => [tempConversation, ...prev]);
            setSelectedConversation(tempConversation);
            setMessages([]);
          }
          
          // Clear the navigation state
          window.history.replaceState({}, document.title);
        }
      }
    };

    handleProfileNavigation();
  }, [location.state, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadCurrentUser = async () => {
    try {
      const response = await usersAPI.getCurrentUserProfile();
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowersAndFollowing = async () => {
    if (!currentUser) {
      return;
    }
    
    try {
      setLoadingUsers(true);
      const [followersResponse, followingResponse] = await Promise.all([
        usersAPI.getFollowers(currentUser.username, 1, 100),
        usersAPI.getFollowing(currentUser.username, 1, 100)
      ]);
      
      setFollowers(followersResponse.followers || []);
      setFollowing(followingResponse.following || []);
    } catch (error) {
      console.error('Error loading followers/following:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleNewMessage = async () => {
    if (!currentUser) {
      return;
    }
    await loadFollowersAndFollowing();
    setShowNewMessageModal(true);
  };

  const startNewConversation = async (user) => {
    try {
      setLoadingUsers(true); // Show loading state
      setShowNewMessageModal(false); // Close modal first for better UX
      
      const response = await messagesAPI.startConversation(user.username);
      
      if (response.conversation) {
        // Ensure the conversation has the correct format
        const conversation = {
          ...response.conversation,
          other_participant: {
            id: user.id,
            username: user.username,
            full_name: user.full_name || user.username,
            avatar: user.avatar || user.avatar_image || null
          }
        };
        
        // Add new conversation to list if it doesn't exist
        setConversations(prev => {
          const exists = prev.find(conv => conv.id === conversation.id);
          if (!exists) {
            return [conversation, ...prev];
          }
          return prev.map(conv => conv.id === conversation.id ? conversation : conv);
        });
        
        // Select the conversation and load messages
        setSelectedConversation(conversation);
        
        // Load messages for this conversation
        try {
          const messagesResponse = await messagesAPI.getMessages(conversation.id);
          setMessages(messagesResponse.messages || []);
        } catch (messagesError) {
          console.error('Error loading messages:', messagesError);
          setMessages([]); // Start with empty messages
        }
      } else {
        // If no conversation returned, create a new one manually
        const newConversation = {
          id: Date.now(), // Temporary ID
          other_participant: {
            id: user.id,
            username: user.username,
            full_name: user.full_name || user.username,
            avatar: user.avatar || user.avatar_image || null
          },
          last_message: null,
          unread_count: 0
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      
      // Even on error, try to create a conversation UI
      const fallbackConversation = {
        id: `temp-${Date.now()}`,
        other_participant: {
          id: user.id,
          username: user.username,
          full_name: user.full_name || user.username,
          avatar: user.avatar || user.avatar_image || null
        },
        last_message: null,
        unread_count: 0
      };
      
      setConversations(prev => [fallbackConversation, ...prev]);
      setSelectedConversation(fallbackConversation);
      setMessages([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const selectConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      const response = await messagesAPI.getMessages(conversation.id);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);
      const response = await messagesAPI.sendMessage(selectedConversation.id, newMessage.trim());
      
      if (response.message) {
        setMessages(prev => [...prev, response.message]);
        setNewMessage('');
        
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        
        // Update conversation list
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? {
                  ...conv,
                  last_message: {
                    content: response.message.content,
                    created_at: response.message.created_at,
                    sender_username: response.message.sender.username
                  }
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500 dark:text-gray-400">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Conversations List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 ${selectedConversation ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <MessageCircle size={24} className="mr-2" />
              Messages
            </h2>
            <button
              onClick={handleNewMessage}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              title="New message"
            >
              <Edit size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start a conversation with your followers
              </p>
              <button
                onClick={handleNewMessage}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Send your first message
              </button>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {conversation.other_participant.avatar ? (
                      <img
                        src={conversation.other_participant.avatar}
                        alt={conversation.other_participant.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {conversation.other_participant.full_name?.charAt(0) || conversation.other_participant.username?.charAt(0)}
                      </div>
                    )}
                    {/* Online status indicator - you can implement this based on your backend */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {conversation.other_participant.full_name || conversation.other_participant.username}
                      </h3>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.last_message && formatDate(conversation.last_message.created_at)}
                        </span>
                        {/* Unread indicator */}
                        {conversation.unread_count > 0 && (
                          <div className="mt-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {conversation.last_message?.sender_username === currentUser?.username && (
                        <Check size={14} className="text-blue-500" />
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conversation.last_message ? conversation.last_message.content : 'Start a conversation...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              <img
                src={selectedConversation.other_participant.avatar}
                alt={selectedConversation.other_participant.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedConversation.other_participant.full_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{selectedConversation.other_participant.username}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isFromCurrentUser = message.sender.username === currentUser?.username;
              const showAvatar = !isFromCurrentUser && (index === 0 || messages[index - 1].sender.username !== message.sender.username);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isFromCurrentUser && (
                    <div className="mr-2">
                      {showAvatar ? (
                        selectedConversation.other_participant.avatar ? (
                          <img
                            src={selectedConversation.other_participant.avatar}
                            alt={selectedConversation.other_participant.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">
                            {selectedConversation.other_participant.full_name?.charAt(0) || selectedConversation.other_participant.username?.charAt(0)}
                          </div>
                        )
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isFromCurrentUser
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isFromCurrentUser
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedConversation.other_participant.full_name || selectedConversation.other_participant.username}...`}
                  className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-h-32"
                  rows={1}
                  disabled={sendingMessage}
                  style={{ minHeight: '40px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
      
      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                New Message
              </h2>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {loadingUsers ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {showNewMessageModal ? 'Loading contacts...' : 'Starting conversation...'}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Following Section */}
                  {following.length > 0 && (
                    <>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Following ({following.length})
                        </h3>
                      </div>
                      {following
                        .filter(user => 
                          !searchQuery || 
                          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <div
                            key={`following-${user.id}`}
                            onClick={() => startNewConversation(user)}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center space-x-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.full_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                  {user.full_name?.charAt(0) || user.username?.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {user.full_name || user.username}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Followers Section */}
                  {followers.length > 0 && (
                    <>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Followers ({followers.length})
                        </h3>
                      </div>
                      {followers
                        .filter(user => 
                          !searchQuery || 
                          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                          <div
                            key={`follower-${user.id}`}
                            onClick={() => startNewConversation(user)}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center space-x-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.full_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                  {user.full_name?.charAt(0) || user.username?.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {user.full_name || user.username}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* No Results */}
                  {following.length === 0 && followers.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No connections yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Follow some users to start messaging them
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
