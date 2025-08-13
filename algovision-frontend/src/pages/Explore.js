import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { blogAPI } from '../api/blog';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Bookmark,
  User,
  TrendingUp,
  Hash,
  Play,
  Volume2,
  VolumeX,
  Plus,
  MoreHorizontal
} from 'lucide-react';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stories data
  const mockStories = [
    {
      id: 1,
      username: 'algorithm_tips',
      avatar: null,
      hasNewStory: true,
      isViewed: false
    },
    {
      id: 2,
      username: 'coding_daily',
      avatar: null,
      hasNewStory: true,
      isViewed: false
    },
    {
      id: 3,
      username: 'tech_news',
      avatar: null,
      hasNewStory: true,
      isViewed: true
    },
    {
      id: 4,
      username: 'js_tricks',
      avatar: null,
      hasNewStory: true,
      isViewed: false
    },
    {
      id: 5,
      username: 'react_dev',
      avatar: null,
      hasNewStory: true,
      isViewed: true
    },
    {
      id: 6,
      username: 'python_tips',
      avatar: null,
      hasNewStory: true,
      isViewed: false
    }
  ];
    // Mock data for demonstration
  const mockPosts = [
    {
      id: 1,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      likes: 1234,
      comments: 89,
      author: { username: 'coder_dev', avatar: null }
    },
    {
      id: 2,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
      likes: 2156,
      comments: 234,
      author: { username: 'tech_guru', avatar: null }
    },
    {
      id: 3,
      type: 'carousel',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
      likes: 891,
      comments: 45,
      author: { username: 'algorithm_ace', avatar: null }
    },
    {
      id: 4,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=400&fit=crop',
      likes: 3421,
      comments: 187,
      author: { username: 'data_scientist', avatar: null }
    },
    {
      id: 5,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
      likes: 1876,
      comments: 156,
      author: { username: 'ml_expert', avatar: null }
    },
    {
      id: 6,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
      likes: 2654,
      comments: 201,
      author: { username: 'react_dev', avatar: null }
    },
    {
      id: 7,
      type: 'carousel',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
      likes: 1543,
      comments: 98,
      author: { username: 'chart_master', avatar: null }
    },
    {
      id: 8,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=400&fit=crop',
      likes: 4321,
      comments: 345,
      author: { username: 'startup_ceo', avatar: null }
    },
    {
      id: 9,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
      likes: 876,
      comments: 67,
      author: { username: 'team_lead', avatar: null }
    },
    {
      id: 10,
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
      likes: 5432,
      comments: 456,
      author: { username: 'coding_ninja', avatar: null }
    },
    {
      id: 11,
      type: 'carousel',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop',
      likes: 2198,
      comments: 178,
      author: { username: 'ai_researcher', avatar: null }
    },
    {
      id: 12,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop',
      likes: 1987,
      comments: 123,
      author: { username: 'blockchain_dev', avatar: null }
    }
  ];

  const mockSuggestions = [
    {
      id: 1,
      username: 'ai_researcher',
      name: 'Dr. Sarah Chen',
      avatar: null,
      followers: '12.5K',
      isVerified: true,
      category: 'AI/ML'
    },
    {
      id: 2,
      username: 'blockchain_dev',
      name: 'Alex Rodriguez',
      avatar: null,
      followers: '8.2K',
      isVerified: false,
      category: 'Blockchain'
    },
    {
      id: 3,
      username: 'ux_designer',
      name: 'Emma Wilson',
      avatar: null,
      followers: '15.1K',
      isVerified: true,
      category: 'Design'
    },
    {
      id: 4,
      username: 'security_expert',
      name: 'Mike Johnson',
      avatar: null,
      followers: '6.8K',
      isVerified: false,
      category: 'Security'
    }
  ];

  const mockTrends = [
    { tag: 'algorithms', posts: '1.2M', growth: '+15%' },
    { tag: 'react', posts: '890K', growth: '+8%' },
    { tag: 'python', posts: '2.1M', growth: '+12%' },
    { tag: 'machine-learning', posts: '654K', growth: '+20%' },
    { tag: 'javascript', posts: '1.8M', growth: '+5%' },
    { tag: 'docker', posts: '432K', growth: '+18%' }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Hash },
    { id: 'algorithms', label: 'Algorithms', icon: TrendingUp },
    { id: 'web-dev', label: 'Web Dev', icon: Hash },
    { id: 'ai-ml', label: 'AI/ML', icon: Hash },
    { id: 'data-science', label: 'Data Science', icon: Hash },
    { id: 'mobile', label: 'Mobile', icon: Hash }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from APIs
        setPosts(mockPosts);
        setSuggestions(mockSuggestions);
        setTrends(mockTrends);
        setStories(mockStories);
      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StoryCard = ({ story }) => (
    <div className="flex flex-col items-center space-y-1 cursor-pointer">
      <div className={`w-16 h-16 rounded-full p-0.5 ${
        story.hasNewStory && !story.isViewed 
          ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' 
          : story.isViewed
          ? 'bg-gray-300 dark:bg-gray-600'
          : 'bg-gradient-to-tr from-purple-600 to-pink-600'
      }`}>
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full p-0.5">
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {story.avatar ? (
              <img src={story.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              story.username.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[64px] truncate">
        {story.username}
      </span>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className="relative aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
      <img
        src={post.image || post.thumbnail}
        alt=""
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Video indicator */}
      {post.type === 'video' && (
        <div className="absolute top-3 right-3">
          <div className="bg-black bg-opacity-50 rounded-full p-1">
            <Play size={16} className="text-white" fill="white" />
          </div>
        </div>
      )}
      
      {/* Multiple photos indicator */}
      {post.type === 'carousel' && (
        <div className="absolute top-3 right-3">
          <div className="bg-black bg-opacity-50 rounded-full p-1">
            <MoreHorizontal size={16} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center space-x-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-2">
            <Heart size={24} fill="white" />
            <span className="font-bold text-lg">{post.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle size={24} fill="white" />
            <span className="font-bold text-lg">{post.comments}</span>
          </div>
        </div>
      </div>
      
      {/* User avatar overlay */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              post.author.username.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-white text-sm font-medium drop-shadow-lg">
            {post.author.username}
          </span>
        </div>
      </div>
    </div>
  );

  const SuggestionCard = ({ user }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-center space-x-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
            {user.isVerified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</p>
          <p className="text-gray-600 dark:text-gray-300 text-xs">{user.followers} followers</p>
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Follow
        </button>
      </div>
    </div>
  );

  const TrendCard = ({ trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Hash size={16} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">#{trend.tag}</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{trend.posts} posts</p>
        </div>
        <div className="text-right">
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">{trend.growth}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header with Search */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Explore</h1>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search posts, users, tags..."
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Discover trending content and connect with developers</p>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Stories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {/* Add Story Button */}
            <div className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                <Plus size={24} className="text-gray-400 hover:text-blue-500" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Your story</span>
            </div>
            
            {/* Stories */}
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Posts Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${
                    (index + 1) % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  } ${
                    (index + 1) % 11 === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                Trending
              </h2>
              <div className="space-y-2">
                {trends.map((trend, index) => (
                  <TrendCard key={index} trend={trend} />
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                Suggested for you
              </h2>
              <div className="space-y-4">
                {suggestions.map((user) => (
                  <SuggestionCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
