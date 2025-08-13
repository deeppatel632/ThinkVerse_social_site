import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, User, Calendar } from 'lucide-react';
import { postsAPI } from '../api/posts';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getSavedPosts();
      setSavedPosts(response.posts || []);
    } catch (err) {
      setError('Failed to load saved posts');
      console.error('Error fetching saved posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      setSavedPosts(savedPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: response.is_liked, 
              likes_count: response.likes_count 
            }
          : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      await postsAPI.toggleSave(postId);
      setSavedPosts(savedPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error unsaving post:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Saved Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {savedPosts.length} saved post{savedPosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Posts */}
      {savedPosts.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No saved posts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            When you save posts, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <Link
                      to={`/profile/${post.author.username}`}
                      className="font-semibold text-gray-900 dark:text-white hover:underline"
                    >
                      {post.author.username}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Posted {formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>Saved {formatDate(post.saved_at)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleUnsave(post.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Remove from saved"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>

              {/* Post Content */}
              <Link
                to={`/blog/${post.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
              >
                {post.title && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.image_url && (
                  <div className="mb-4">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.is_liked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`}
                  />
                  <span className="text-sm font-medium">{post.likes_count}</span>
                </button>

                <Link
                  to={`/blog/${post.id}`}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.comments_count}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
