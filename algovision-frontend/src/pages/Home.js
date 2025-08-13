import React, { useState, useEffect, useRef } from 'react';
import BlogCard from '../components/BlogCard';
import { postsAPI } from '../api/posts';
import { Image, Hash, Smile, Calendar, MapPin, BarChart3, X, Upload, Plus } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Post creation states
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showFullPostForm, setShowFullPostForm] = useState(false);
  
  // Enhanced post features
  const [selectedImages, setSelectedImages] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  // Refs
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setShowHashtagInput(false);
        setShowLocationInput(false);
        setShowScheduler(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      setPosts(response.posts || []);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
      // Use dummy data as fallback
      setPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      return;
    }

    try {
      setIsPosting(true);
      const postData = {
        content: postContent,
        title: postTitle || '',
        media_type: selectedImages.length > 0 ? 'image' : 'none',
        tags: hashtags,
        location: location || null,
        scheduled_date: scheduledDate || null,
        poll_options: showPollCreator ? pollOptions.filter(opt => opt.trim()) : null
      };

      const response = await postsAPI.createPost(postData);
      
      if (response.success) {
        // Add new post to the beginning of the list
        setPosts(prevPosts => [response.post, ...prevPosts]);
        
        // Reset form
        resetPostForm();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      
      if (response.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  is_liked: response.is_liked,
                  likes_count: response.likes_count 
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const response = await postsAPI.toggleSave(postId);
      
      if (response.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  is_saved: response.is_saved
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Dummy data for fallback
  const dummyPosts = [
    {
      id: 1,
      title: 'Understanding Binary Search Trees',
      content: 'Binary Search Trees (BST) are a fundamental data structure in computer science. They provide efficient searching, insertion, and deletion operations with an average time complexity of O(log n). In this post, we\'ll explore the key concepts, implementation details, and common use cases of BSTs.',
      author: { username: 'alex_coder', id: 1 },
      created_at: '2024-01-15T10:30:00Z',
      likes_count: 42,
      comments_count: 8,
      tags: ['algorithms', 'data-structures', 'python'],
      image_url: null,
    },
    {
      id: 2,
      title: 'Implementing Dijkstra\'s Algorithm',
      content: 'Dijkstra\'s algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with non-negative edge path costs. It\'s widely used in routing and navigation systems. Let\'s implement it step by step with clear explanations and code examples.',
      author: { username: 'sarah_dev', id: 2 },
      created_at: '2024-01-14T15:45:00Z',
      likes_count: 67,
      comments_count: 12,
      tags: ['algorithms', 'graphs', 'javascript'],
      image_url: null,
    },
    {
      id: 3,
      title: 'Machine Learning Basics: Linear Regression',
      content: 'Linear regression is one of the most fundamental algorithms in machine learning. It\'s used to predict continuous values based on input features. In this comprehensive guide, we\'ll cover the mathematical foundations, implementation, and practical applications.',
      author: { username: 'mike_tech', id: 3 },
      created_at: '2024-01-13T09:15:00Z',
      likes_count: 89,
      comments_count: 15,
      tags: ['machine-learning', 'python', 'statistics'],
      image_url: null,
    },
    {
      id: 4,
      title: 'React Performance Optimization Techniques',
      content: 'Performance is crucial for modern web applications. In this post, we\'ll explore various techniques to optimize React applications, including memoization, code splitting, lazy loading, and best practices for state management.',
      author: { username: 'alex_coder', id: 1 },
      created_at: '2024-01-12T14:20:00Z',
      likes_count: 34,
      comments_count: 6,
      tags: ['react', 'javascript', 'performance'],
      image_url: null,
    },
    {
      id: 5,
      title: 'Docker Containerization Best Practices',
      content: 'Docker has revolutionized how we deploy and manage applications. This guide covers essential best practices for containerization, including multi-stage builds, security considerations, and optimization techniques for production deployments.',
      author: { username: 'sarah_dev', id: 2 },
      created_at: '2024-01-11T11:30:00Z',
      likes_count: 56,
      comments_count: 9,
      tags: ['docker', 'devops', 'deployment'],
      image_url: null,
    },
  ];

  const handleTextareaFocus = () => {
    setShowFullPostForm(true);
  };

  // Handler functions for post features
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleAddHashtag = () => {
    if (currentHashtag.trim() && !hashtags.includes(currentHashtag.trim())) {
      setHashtags(prev => [...prev, currentHashtag.trim()]);
      setCurrentHashtag('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const addEmoji = (emoji) => {
    setPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleLocationToggle = () => {
    setShowLocationInput(!showLocationInput);
    if (!showLocationInput) {
      setLocation('');
    }
  };

  const handleScheduleToggle = () => {
    setShowScheduler(!showScheduler);
    if (!showScheduler) {
      setScheduledDate('');
    }
  };

  const handlePollToggle = () => {
    setShowPollCreator(!showPollCreator);
    if (!showPollCreator) {
      setPollOptions(['', '']);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const updatePollOption = (index, value) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option));
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const resetPostForm = () => {
    setPostContent('');
    setPostTitle('');
    setSelectedImages([]);
    setHashtags([]);
    setCurrentHashtag('');
    setLocation('');
    setScheduledDate('');
    setPollOptions(['', '']);
    setShowFullPostForm(false);
    setShowHashtagInput(false);
    setShowEmojiPicker(false);
    setShowLocationInput(false);
    setShowScheduler(false);
    setShowPollCreator(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading blogs...</div>
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

  return (
    <div className="flex-1 max-w-2xl mx-auto p-6">
      {/* Post Creation Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex space-x-3">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            U
          </div>
          
          {/* Post Content */}
          <div className="flex-1">
            {/* Title Input (shows when expanded) */}
            {showFullPostForm && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Add a title (optional)"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {/* Main Content Textarea */}
            <textarea
              placeholder="What's happening in the algorithm world?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onFocus={handleTextareaFocus}
              rows={showFullPostForm ? 4 : 1}
              className="w-full p-3 border-0 resize-none text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none"
            />
            
            {/* Action Bar */}
            {showFullPostForm && (
              <div className="space-y-4">
                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {selectedImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeHashtag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Location Display */}
                {location && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <MapPin size={16} className="text-blue-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{location}</span>
                    <button
                      onClick={() => setLocation('')}
                      className="ml-auto text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Scheduled Date Display */}
                {scheduledDate && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Calendar size={16} className="text-blue-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Scheduled for: {new Date(scheduledDate).toLocaleString()}
                    </span>
                    <button
                      onClick={() => setScheduledDate('')}
                      className="ml-auto text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Poll Creator */}
                {showPollCreator && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Create Poll</span>
                      <button
                        onClick={handlePollToggle}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          {pollOptions.length > 2 && (
                            <button
                              onClick={() => removePollOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {pollOptions.length < 4 && (
                        <button
                          onClick={addPollOption}
                          className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Option
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  {/* Action Icons */}
                  <div ref={emojiPickerRef} className="flex space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                      title="Add images"
                    >
                      <Image size={20} />
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowHashtagInput(!showHashtagInput);
                          setShowEmojiPicker(false);
                          setShowLocationInput(false);
                          setShowScheduler(false);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Add hashtag"
                      >
                        <Hash size={20} />
                      </button>
                      {showHashtagInput && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[250px]">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Add hashtag"
                              value={currentHashtag}
                              onChange={(e) => setCurrentHashtag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                            <button
                              onClick={handleAddHashtag}
                              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowEmojiPicker(!showEmojiPicker);
                          setShowHashtagInput(false);
                          setShowLocationInput(false);
                          setShowScheduler(false);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Add emoji"
                      >
                        <Smile size={20} />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                          <div className="grid grid-cols-8 gap-1 max-w-[280px]">
                            {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => addEmoji(emoji)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowScheduler(!showScheduler);
                          setShowHashtagInput(false);
                          setShowEmojiPicker(false);
                          setShowLocationInput(false);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Schedule post"
                      >
                        <Calendar size={20} />
                      </button>
                      {showScheduler && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                          <input
                            type="datetime-local"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowLocationInput(!showLocationInput);
                          setShowHashtagInput(false);
                          setShowEmojiPicker(false);
                          setShowScheduler(false);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Add location"
                      >
                        <MapPin size={20} />
                      </button>
                      {showLocationInput && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Add location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={handlePollToggle}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                      title="Create poll"
                    >
                      <BarChart3 size={20} />
                    </button>
                  </div>
                  
                  {/* Character Count and Post Button */}
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {postContent.length}/280
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={(!postContent.trim() && !postTitle.trim()) || isPosting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-full transition-colors"
                    >
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Latest Algorithm Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the latest insights in algorithms, data structures, and computer science
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <BlogCard 
            key={post.id} 
            blog={post} 
            onLike={() => handleLikePost(post.id)}
            onSave={() => handleSavePost(post.id)}
          />
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            No posts found
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Be the first to share your algorithm insights!
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg">
            {error}
          </div>
          <button 
            onClick={fetchPosts}
            className="mt-2 text-blue-500 hover:text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 