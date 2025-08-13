import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { postsAPI } from '../api/posts';
import { messagesAPI } from '../api/messages';
import BlogCard from '../components/BlogCard';
import FollowersFollowing from '../components/FollowersFollowing';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  UserPlus,
  UserMinus,
  Edit,
  CheckCircle,
  Shield,
  UserX,
  MessageCircle
} from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [mediaPosts, setMediaPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let userData;
        
        if (username) {
          // Get specific user profile
          const response = await usersAPI.getUserProfile(username);
          userData = response.user;
        } else {
          // Get current user profile
          const response = await usersAPI.getCurrentUserProfile();
          userData = response.user;
        }
        
        setUser(userData);
        setIsFollowing(userData.is_following || false);
        setIsCurrentUser(userData.is_own_profile || false);
        
        // Load user's posts
        try {
          const postsResponse = await postsAPI.getUserPosts(userData.id);
          setPosts(postsResponse.posts || []);
        } catch (postError) {
          console.error('Error fetching posts:', postError);
          setPosts([]);
        }

        // Load saved posts if it's the current user
        if (userData.is_own_profile) {
          try {
            const savedResponse = await postsAPI.getSavedPosts();
            setSavedPosts(savedResponse.posts || []);
          } catch (savedError) {
            console.error('Error fetching saved posts:', savedError);
            setSavedPosts([]);
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!user || isFollowLoading) {
      return;
    }
    
    try {
      setIsFollowLoading(true);
      const response = await usersAPI.toggleFollow(user.username);
      
      setIsFollowing(response.is_following);
      setUser(prev => ({
        ...prev,
        followers_count: response.is_following 
          ? prev.followers_count + 1 
          : prev.followers_count - 1
      }));
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!user) {
      return;
    }
    
    try {
      await usersAPI.blockUser(user.username);
      setIsFollowing(false);
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  const handleStartConversation = async () => {
    if (!user || isCurrentUser) {
      console.log('Cannot start conversation: no user or is current user');
      return;
    }
    
    try {
      console.log('Starting conversation with:', user.username);
      
      // Start conversation and redirect to messages
      const response = await messagesAPI.startConversation(user.username);
      console.log('Conversation response:', response);
      
      if (response && response.conversation) {
        // Navigate to messages page and pass conversation ID
        navigate('/messages', { 
          state: { 
            conversationId: response.conversation.id,
            user: user 
          } 
        });
      } else {
        // If no conversation returned, still navigate to messages
        console.log('No conversation returned, navigating to messages anyway');
        navigate('/messages', { 
          state: { 
            user: user 
          } 
        });
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      // Even if there's an error, navigate to messages with user info
      navigate('/messages', { 
        state: { 
          user: user 
        } 
      });
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      
      if (response.success) {
        // Update posts in all relevant arrays
        const updatePost = (post) => post.id === postId ? { 
          ...post, 
          is_liked: response.is_liked,
          likes_count: response.likes_count 
        } : post;
        
        setPosts(prevPosts => prevPosts.map(updatePost));
        setLikedPosts(prevPosts => prevPosts.map(updatePost));
        setReplies(prevPosts => prevPosts.map(updatePost));
        setMediaPosts(prevPosts => prevPosts.map(updatePost));
        setSavedPosts(prevPosts => prevPosts.map(updatePost));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const response = await postsAPI.toggleSave(postId);
      
      if (response.success) {
        // Update posts in all relevant arrays
        const updatePost = (post) => post.id === postId ? { 
          ...post, 
          is_saved: response.is_saved 
        } : post;
        
        setPosts(prevPosts => prevPosts.map(updatePost));
        setLikedPosts(prevPosts => prevPosts.map(updatePost));
        setReplies(prevPosts => prevPosts.map(updatePost));
        setMediaPosts(prevPosts => prevPosts.map(updatePost));
        
        if (response.is_saved) {
          // If post was saved, we might need to refresh saved posts
          if (activeTab === 'saved') {
            loadTabData('saved');
          }
        } else {
          // If post was unsaved, remove it from saved posts
          setSavedPosts(prevSavedPosts => 
            prevSavedPosts.filter(post => post.id !== postId)
          );
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleEditProfile = () => {
    setEditFormData({
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Starting profile update with data:', editFormData);
      
      const response = await usersAPI.updateProfile(editFormData);
      console.log('Profile update response:', response);
      
      setUser(prevUser => ({
        ...prevUser,
        bio: response.user.bio || '',
        location: response.user.location || '',
        website: response.user.website || ''
      }));
      setIsEditModalOpen(false);
      console.log('Profile updated successfully');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('Please log in again to update your profile. You will be redirected to the login page.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in properly.');
      } else {
        alert('Error updating profile: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditFormChange = (e) => {
    console.log('Form field changed:', e.target.name, '=', e.target.value);
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadTabData = async (tabId) => {
    if (!user) return;
    
    try {
      setTabLoading(true);
      switch (tabId) {
        case 'likes':
          if (likedPosts.length === 0) {
            const response = await postsAPI.getUserLikedPosts(user.username);
            setLikedPosts(response.posts || []);
          }
          break;
        case 'replies':
          if (replies.length === 0) {
            const response = await postsAPI.getUserReplies(user.username);
            setReplies(response.posts || []);
          }
          break;
        case 'media':
          if (mediaPosts.length === 0) {
            const response = await postsAPI.getUserMediaPosts(user.username);
            setMediaPosts(response.posts || []);
          }
          break;
        case 'saved':
          if (savedPosts.length === 0 && isCurrentUser) {
            const response = await postsAPI.getSavedPosts();
            setSavedPosts(response.posts || []);
          }
          break;
        default:
          // Posts are already loaded
          break;
      }
    } catch (err) {
      console.error(`Error loading ${tabId}:`, err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    loadTabData(tabId);
  };

  const tabs = [
    { id: 'posts', label: 'Posts', count: user?.posts_count || 0 },
    { id: 'replies', label: 'Replies', count: user?.replies_count || 0 },
    { id: 'media', label: 'Media', count: user?.media_count || 0 },
    { id: 'likes', label: 'Likes', count: user?.likes_count || 0 },
    ...(isCurrentUser ? [{ id: 'saved', label: 'Saved', count: user?.saved_count || 0 }] : [])
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto min-h-screen bg-white dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500">
          {user?.cover_image && (
            <img 
              src={user.cover_image} 
              alt="Cover" 
              className="w-full h-48 object-cover"
            />
          )}
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-white dark:border-gray-900 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {user?.avatar_image ? (
                <img 
                  src={user.avatar_image} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>
            {user?.is_verified && (
              <CheckCircle 
                size={24} 
                className="absolute bottom-2 right-2 text-blue-500 bg-white rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex justify-end px-4 pt-4 pb-3">
        {!isCurrentUser && (
          <div className="flex space-x-2">
            <div className="relative">
              <button 
                onClick={() => {/* More options dropdown */}}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <MoreHorizontal size={20} />
              </button>
              {/* Dropdown for block/report options */}
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStartConversation();
              }}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Send message"
              type="button"
            >
              <MessageCircle size={20} />
            </button>
            <button 
              onClick={handleBlockUser}
              className="p-2 border border-red-300 dark:border-red-600 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Block user"
            >
              <UserX size={20} />
            </button>
            <button 
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2 ${
                isFollowing
                  ? 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
              <span>{isFollowLoading ? '...' : isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 pt-20">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span>{user?.full_name || user?.username}</span>
            {user?.is_verified && (
              <CheckCircle size={20} className="text-blue-500" />
            )}
            {user?.is_private && (
              <Shield size={16} className="text-gray-500" />
            )}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
        </div>

        {user?.bio && (
          <div className="mb-3">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm space-x-4 mb-3">
          {user?.location && (
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
          )}
          {user?.website && (
            <div className="flex items-center space-x-1">
              <LinkIcon size={16} />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {user.website.replace('https://', '')}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>Joined {formatDate(user?.date_joined)}</span>
          </div>
        </div>

        <div className="flex space-x-6">
          <button 
            onClick={() => setShowFollowingModal(true)}
            className="flex space-x-1 hover:underline"
          >
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user?.following_count || 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Following
            </span>
          </button>
          <button 
            onClick={() => setShowFollowersModal(true)}
            className="flex space-x-1 hover:underline"
          >
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user?.followers_count || 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Followers
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-4 px-4 text-center relative hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-gray-100 font-semibold'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span className="ml-1 text-sm">({tab.count})</span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'posts' && (
          <div>
            {posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <BlogCard 
                  blog={post}
                  onLike={() => handleLikePost(post.id)}
                  onSave={isCurrentUser ? () => handleSavePost(post.id) : undefined}
                />
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {isCurrentUser ? "You haven't posted anything yet" : "No posts yet"}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {isCurrentUser ? 'Share your first algorithm insight!' : 'When they post, it will appear here.'}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'replies' && (
          <div>
            {tabLoading ? (
              <div className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400">Loading replies...</div>
              </div>
            ) : replies.length > 0 ? (
              replies.map((reply) => (
                <div key={reply.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <BlogCard 
                    blog={reply}
                    onLike={() => handleLikePost(reply.id)}
                    onSave={isCurrentUser ? () => handleSavePost(reply.id) : undefined}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No replies yet
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  When they reply to posts, it will appear here.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            {tabLoading ? (
              <div className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400">Loading media...</div>
              </div>
            ) : mediaPosts.length > 0 ? (
              mediaPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <BlogCard 
                    blog={post}
                    onLike={() => handleLikePost(post.id)}
                    onSave={isCurrentUser ? () => handleSavePost(post.id) : undefined}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No media yet
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Photos and videos posted will appear here.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            {tabLoading ? (
              <div className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400">Loading liked posts...</div>
              </div>
            ) : likedPosts.length > 0 ? (
              likedPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <BlogCard 
                    blog={post}
                    onLike={() => handleLikePost(post.id)}
                    onSave={isCurrentUser ? () => handleSavePost(post.id) : undefined}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No likes yet
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Liked posts will appear here.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && isCurrentUser && (
          <div>
            {tabLoading ? (
              <div className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400">Loading saved posts...</div>
              </div>
            ) : savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <BlogCard 
                    blog={post}
                    onLike={() => handleLikePost(post.id)}
                    onSave={() => handleSavePost(post.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No saved posts yet
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Posts you save will appear here.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="text-2xl text-gray-500 dark:text-gray-400">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={editFormData.bio}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={editFormData.website}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowersFollowing
          username={user?.username}
          type="followers"
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <FollowersFollowing
          username={user?.username}
          type="following"
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </div>
  );
};

export default Profile; 