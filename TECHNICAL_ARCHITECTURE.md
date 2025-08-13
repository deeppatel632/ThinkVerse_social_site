# Thinkverse - Technical Architecture and Project Flow Documentation

## Project Overview
**Thinkverse** is a comprehensive algorithm visualization and discussion platform built using Django (backend) and React (frontend). The application provides a full-featured social platform for algorithm enthusiasts to share insights, discuss problems, and visualize algorithms with real-time interactions, user authentication, messaging system, and comprehensive content management.

## Technology Stack

### Backend Technologies
- **Django 4.2.23** (Web Framework)
- **Django REST Framework** (API Framework)
- **SQLite** (Database - Development)
- **Python 3.9+** (Runtime Environment)
- **CORS Headers** (Cross-Origin Resource Sharing)
- **Session Authentication** (Built-in Django Authentication)
- **CSRF Protection** (Cross-Site Request Forgery Protection)

### Frontend Technologies
- **React 18** (UI Library)
- **React Router v6** (Client-side Routing)
- **Axios** (HTTP Client)
- **Tailwind CSS** (Utility-first CSS Framework)
- **Lucide React** (Icon Library)
- **React Markdown** (Markdown Rendering)
- **Vite** (Build Tool and Development Server)

### Development Tools
- **Docker & Docker Compose** (Containerization)
- **Python Virtual Environment** (Dependency Isolation)
- **npm/Node.js** (Frontend Package Management)
- **SQLite Browser** (Database Management)

## Project Structure

```
Thinkverse/
├── manage.py                    # Django management script
├── docker-compose.yml          # Multi-container orchestration
├── create_dummy_accounts.py     # Test data creation script
├── create_sample_blogs.py       # Sample content generation
├── create_test_content.py       # Test content utilities
├── test_auth.sh                 # Authentication testing script
├── TEST_ACCOUNTS.md            # Test account documentation
├── README.md                   # Project documentation
├── TECHNICAL_ARCHITECTURE.md   # This technical documentation
├── algovision-backend/         # DJANGO BACKEND APPLICATION
│   ├── manage.py               # Django project management
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Backend containerization
│   ├── env.example            # Environment variables template
│   ├── db.sqlite3             # SQLite database file
│   ├── config/                # Django project configuration
│   │   ├── __init__.py        # Python package marker
│   │   ├── settings.py        # Django settings configuration
│   │   ├── urls.py            # Root URL routing
│   │   ├── wsgi.py           # WSGI application entry point
│   │   └── asgi.py           # ASGI application entry point
│   ├── blogs/                 # Blog application module
│   │   ├── __init__.py       # Python package marker
│   │   ├── models.py         # Blog data models
│   │   ├── views.py          # Blog API views
│   │   ├── urls.py           # Blog URL routing
│   │   ├── admin.py          # Django admin configuration
│   │   ├── apps.py           # App configuration
│   │   ├── tests.py          # Unit tests
│   │   └── migrations/       # Database migration files
│   ├── comments/             # Comments application module
│   │   ├── __init__.py       # Python package marker
│   │   ├── models.py         # Comment data models
│   │   ├── views.py          # Comment API views
│   │   ├── urls.py           # Comment URL routing
│   │   ├── admin.py          # Django admin configuration
│   │   ├── apps.py           # App configuration
│   │   ├── tests.py          # Unit tests
│   │   └── migrations/       # Database migration files
│   ├── users/                # User management application
│   │   ├── __init__.py       # Python package marker
│   │   ├── models.py         # User data models
│   │   ├── views.py          # User API views
│   │   ├── urls.py           # User URL routing
│   │   ├── admin.py          # Django admin configuration
│   │   ├── apps.py           # App configuration
│   │   ├── tests.py          # Unit tests
│   │   └── migrations/       # Database migration files
│   └── messaging/            # Messaging system application
│       ├── __init__.py       # Python package marker
│       ├── models.py         # Message data models
│       ├── views.py          # Message API views
│       ├── urls.py           # Message URL routing
│       ├── admin.py          # Django admin configuration
│       ├── apps.py           # App configuration
│       ├── tests.py          # Unit tests
│       └── migrations/       # Database migration files
└── algovision-frontend/       # REACT FRONTEND APPLICATION
    ├── package.json          # Node.js dependencies and scripts
    ├── Dockerfile           # Frontend containerization
    ├── env.example          # Environment variables template
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── public/              # Static public assets
    │   └── index.html       # HTML template
    ├── build/               # Production build output
    └── src/                 # Source code directory
        ├── index.js         # React application entry point
        ├── App.js           # Main application component
        ├── App.css          # Application-wide styles
        ├── index.css        # Global CSS styles
        ├── api/             # API communication modules
        │   ├── axios.js     # Axios HTTP client configuration
        │   ├── auth.js      # Authentication API calls
        │   ├── users.js     # User management API calls
        │   ├── posts.js     # Post/blog API calls
        │   ├── blog.js      # Blog-specific API calls
        │   ├── comments.js  # Comment API calls
        │   └── messages.js  # Messaging API calls
        ├── components/      # Reusable UI components
        │   ├── Navbar.js    # Top navigation component
        │   ├── Sidebar.js   # Left sidebar navigation
        │   ├── Rightbar.js  # Right sidebar component
        │   ├── BlogCard.js  # Blog post card component
        │   ├── CommentThread.js       # Comment system component
        │   ├── FollowersFollowing.js  # User relationship component
        │   ├── UserSearch.js          # User search functionality
        │   └── AuthDebug.js           # Authentication debugging
        └── pages/           # Page-level components
            ├── Home.js      # Home/feed page
            ├── Login.js     # User login page
            ├── Register.js  # User registration page
            ├── Profile.js   # User profile page
            ├── BlogDetails.js # Individual blog post page
            ├── Explore.js   # Content exploration page
            ├── Messages.js  # Messaging interface
            ├── SavedPosts.js # Saved content page
            └── UserDiscovery.js # User discovery page
```

## Architecture Flow

### 1. Application Entry Points

#### Backend Entry (manage.py & config/settings.py)
```python
# manage.py - Django management script
import os
import sys
import django
from django.core.management import execute_from_command_line

# Sets up Django environment and executes management commands
# Handles database migrations, server startup, and admin commands

# config/settings.py - Main Django configuration
INSTALLED_APPS = [
    'django.contrib.admin',      # Admin interface
    'django.contrib.auth',       # Authentication system
    'django.contrib.contenttypes',  # Content type framework
    'django.contrib.sessions',   # Session framework
    'corsheaders',              # CORS handling
    'blogs',                    # Blog application
    'comments',                 # Comment system
    'users',                    # User management
    'messaging',                # Messaging system
]

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS configuration for React frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### Frontend Entry (src/index.js & src/App.js)
```javascript
// src/index.js - React application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Creates React root and renders main App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/App.js - Main application component with routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:username?" element={<Profile />} />
              {/* Additional routes */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
```

### 2. Database Architecture & Models

#### User Management (users/models.py)
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Extended User model with additional profile fields
    Inherits from Django's AbstractUser for authentication
    """
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar_image = models.URLField(blank=True)
    cover_image = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Follow(models.Model):
    """
    User relationship model for following system
    Creates many-to-many relationship between users
    """
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

class BlockedUser(models.Model):
    """
    User blocking system
    Prevents interaction between blocked users
    """
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocking')
    blocked = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by')
    created_at = models.DateTimeField(auto_now_add=True)
```

#### Blog System (blogs/models.py)
```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    """
    Main blog post model
    Stores algorithm discussions and content
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    image_url = models.URLField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)

class PostLike(models.Model):
    """
    Post liking system
    Tracks user likes on posts
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

class SavedPost(models.Model):
    """
    Post bookmarking system
    Allows users to save posts for later
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)
```

#### Comment System (comments/models.py)
```python
class Comment(models.Model):
    """
    Threaded comment system
    Supports nested comments for discussions
    """
    post = models.ForeignKey('blogs.Post', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        
    def get_replies(self):
        """
        Returns all nested replies for threading
        """
        return Comment.objects.filter(parent=self).order_by('created_at')
```

#### Messaging System (messaging/models.py)
```python
class Conversation(models.Model):
    """
    Private messaging conversation
    Connects two users for direct communication
    """
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    """
    Individual message within conversation
    Stores message content and metadata
    """
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 3. API Architecture & Views

#### Authentication System (users/views.py)
```python
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def login_view(request):
    """
    User authentication endpoint
    Handles login credentials and session creation
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            })
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'})

@login_required
def get_current_user_profile(request):
    """
    Returns current authenticated user's profile
    Includes follower/following counts and profile data
    """
    user = request.user
    profile_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'location': user.location,
        'website': user.website,
        'followers_count': user.followers.count(),
        'following_count': user.following.count(),
        'posts_count': user.posts.count(),
        'is_own_profile': True
    }
    return JsonResponse({'user': profile_data})
```

#### Blog Management (blogs/views.py)
```python
from django.shortcuts import get_object_or_404
from .models import Post, PostLike, SavedPost

@login_required
def create_post(request):
    """
    Creates new blog post
    Handles content creation and validation
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.create(
            title=data.get('title'),
            content=data.get('content'),
            author=request.user,
            image_url=data.get('image_url', ''),
            tags=data.get('tags', [])
        )
        return JsonResponse({
            'success': True,
            'post': {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'created_at': post.created_at.isoformat()
            }
        })

@login_required
def toggle_like_post(request, post_id):
    """
    Handles post like/unlike functionality
    Updates like count and user like status
    """
    post = get_object_or_404(Post, id=post_id)
    like, created = PostLike.objects.get_or_create(user=request.user, post=post)
    
    if not created:
        like.delete()
        is_liked = False
        post.likes_count = max(0, post.likes_count - 1)
    else:
        is_liked = True
        post.likes_count += 1
    
    post.save()
    
    return JsonResponse({
        'success': True,
        'is_liked': is_liked,
        'likes_count': post.likes_count
    })
```

### 4. Frontend API Communication

#### Axios Configuration (src/api/axios.js)
```javascript
import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Include cookies for session auth
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookies
    const token = getCookie('csrftoken');
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on authentication error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default apiClient;
```

#### Authentication API (src/api/auth.js)
```javascript
import apiClient from './axios';

// User login function
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/api/auth/login/', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// User registration function
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/api/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// User logout function
export const logout = async () => {
  try {
    await apiClient.post('/api/auth/logout/');
    return { success: true };
  } catch (error) {
    throw new Error('Logout failed');
  }
};

// Check authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/api/auth/me/');
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};
```

#### Posts API (src/api/posts.js)
```javascript
import apiClient from './axios';

// Fetch all posts for feed
export const getAllPosts = async () => {
  try {
    const response = await apiClient.get('/api/posts/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch posts');
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post('/api/posts/', postData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create post');
  }
};

// Like/unlike post
export const toggleLike = async (postId) => {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/like/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to toggle like');
  }
};

// Save/unsave post
export const toggleSave = async (postId) => {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/save/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to toggle save');
  }
};

// Get user's posts
export const getUserPosts = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}/posts/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user posts');
  }
};
```

### 5. Frontend Component Architecture

#### Main Navigation (src/components/Navbar.js)
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onMenuToggle, showSidebar }) => {
  /**
   * Top navigation component
   * Handles mobile menu toggle and displays app title
   * Responsive design with mobile-first approach
   */
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile menu button - only visible on small screens */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* App title with routing link */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Thinkverse
          </h1>
        </Link>

        {/* Placeholder for future features (notifications, user menu) */}
        <div className="w-8 h-8" />
      </div>
    </div>
  );
};

export default Navbar;
```

#### Sidebar Navigation (src/components/Sidebar.js)
```javascript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Bookmark, MessageCircle } from 'lucide-react';

const Sidebar = () => {
  /**
   * Left sidebar navigation component
   * Provides main navigation links with active state indication
   * Sticky positioning for persistent navigation
   */
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 overflow-hidden sticky top-0">
      {/* Logo section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Thinkverse
        </h1>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
```

#### Blog Card Component (src/components/BlogCard.js)
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const BlogCard = ({ blog, onLike, onSave }) => {
  /**
   * Individual blog post display component
   * Handles post content, interactions, and navigation
   * Includes like, comment, and save functionality
   */
  const {
    id,
    title,
    content,
    author,
    created_at,
    likes_count,
    comments_count,
    tags = [],
    image_url,
    is_liked = false,
    is_saved = false
  } = blog;

  // Generate random placeholder image if no image_url exists
  const getImageUrl = () => {
    if (image_url) {
      return image_url;
    }
    // Generate consistent random image based on post ID
    return `https://picsum.photos/seed/${id}/600/300`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Author information */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {author?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {author?.username || 'Anonymous'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(created_at)}
          </div>
        </div>
        {/* Save button */}
        <button 
          onClick={onSave}
          className={`transition-colors ${
            is_saved 
              ? 'text-blue-500 dark:text-blue-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title={is_saved ? 'Remove from saved' : 'Save post'}
        >
          <Bookmark size={20} fill={is_saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Post content */}
      <div className="mb-4">
        <Link to={`/blog/${id}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">
            {title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {content.length > 200 ? `${content.substring(0, 200)}...` : content}
        </p>
      </div>

      {/* Post image - always displayed */}
      <div className="mb-4">
        <img
          src={getImageUrl()}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          {/* Like button */}
          <button 
            onClick={onLike}
            className={`flex items-center space-x-2 transition-colors ${
              is_liked 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart 
              size={18} 
              fill={is_liked ? 'currentColor' : 'none'}
            />
            <span className="text-sm">{likes_count || 0}</span>
          </button>
          
          {/* Comment button */}
          <Link
            to={`/blog/${id}`}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{comments_count || 0}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
```

### 6. Page Components

#### Home Feed (src/pages/Home.js)
```javascript
import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { getAllPosts, toggleLike, toggleSave } from '../api/posts';

const Home = () => {
  /**
   * Main feed page component
   * Displays list of all posts with infinite scroll potential
   * Handles post interactions (like, save)
   */
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response.posts || []);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle post like toggle
  const handleLike = async (postId) => {
    try {
      const response = await toggleLike(postId);
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

  // Handle post save toggle
  const handleSave = async (postId) => {
    try {
      const response = await toggleSave(postId);
      if (response.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, is_saved: response.is_saved }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Algorithm Feed
      </h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No posts yet
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Be the first to share an algorithm insight!
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              blog={post}
              onLike={() => handleLike(post.id)}
              onSave={() => handleSave(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
```

#### User Profile (src/pages/Profile.js)
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { postsAPI } from '../api/posts';
import BlogCard from '../components/BlogCard';
import { Calendar, MapPin, Link as LinkIcon, UserPlus, UserMinus } from 'lucide-react';

const Profile = () => {
  /**
   * User profile page component
   * Displays user information, posts, and interaction options
   * Supports profile editing for current user
   */
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let userData;
        
        if (username) {
          const response = await usersAPI.getUserProfile(username);
          userData = response.user;
        } else {
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
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!user) return;
    
    try {
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
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
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
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex justify-end px-4 pt-4 pb-3">
        {!isCurrentUser && (
          <button 
            onClick={handleFollowToggle}
            className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2 ${
              isFollowing
                ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 pt-20">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {user?.full_name || user?.username}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
        </div>

        {user?.bio && (
          <div className="mb-3">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
              {user.bio}
            </p>
          </div>
        )}

        {/* User metadata */}
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

        {/* Follow stats */}
        <div className="flex space-x-6">
          <div className="flex space-x-1">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user?.following_count || 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Following</span>
          </div>
          <div className="flex space-x-1">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user?.followers_count || 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Followers</span>
          </div>
        </div>
      </div>

      {/* Posts section */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Posts ({posts.length})
          </h3>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400">
                {isCurrentUser ? "You haven't posted anything yet" : "No posts yet"}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  blog={post}
                  onLike={() => {/* Handle like */}}
                  onSave={() => {/* Handle save */}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
```

### 7. Data Flow Architecture

#### Authentication Flow
```
Login Page (Login.js) → 
  ↓ (username/password)
Auth API (auth.js) → 
  ↓ (POST /api/auth/login/)
Django Auth View (users/views.py) → 
  ↓ (authenticate & login)
Session Creation → 
  ↓ (session cookie)
Frontend State Update → 
  ↓ (user data storage)
Route Protection (App.js)
```

#### Post Creation Flow
```
Post Form → 
  ↓ (title, content, tags)
Posts API (posts.js) → 
  ↓ (POST /api/posts/)
Blog View (blogs/views.py) → 
  ↓ (validation & save)
Database Storage (Post model) → 
  ↓ (new post data)
Feed Update (Home.js) → 
  ↓ (state refresh)
UI Re-render
```

#### Real-time Interaction Flow
```
User Action (like/save button) → 
  ↓ (click event)
Component Handler (BlogCard.js) → 
  ↓ (API call)
Backend Processing (toggle_like/save) → 
  ↓ (database update)
Response Data → 
  ↓ (updated counts/status)
State Update (useState) → 
  ↓ (component re-render)
UI Feedback (visual changes)
```

### 8. Security Architecture

#### Authentication & Session Management
- **Django Sessions** - Server-side session storage
- **CSRF Protection** - Cross-site request forgery prevention
- **CORS Configuration** - Origin-based access control
- **Password Hashing** - Built-in Django password security

#### API Security
- **Session Authentication** - Required for protected endpoints
- **Request Validation** - Input sanitization and validation
- **HTTP-only Cookies** - Secure session token storage
- **Error Handling** - Sanitized error responses

### 9. Performance Optimizations

#### Frontend Optimizations
- **Code Splitting** - Route-based component loading
- **Image Optimization** - Placeholder images with consistent seeding
- **API Response Caching** - Reduced redundant requests
- **Efficient Re-rendering** - Optimized React state updates

#### Backend Optimizations
- **Database Indexing** - Optimized query performance
- **Pagination** - Large dataset handling
- **Query Optimization** - Efficient Django ORM usage
- **Static File Serving** - Optimized asset delivery

### 10. Development & Deployment

#### Development Workflow
```bash
# Backend development
cd algovision-backend
source venv/bin/activate
python manage.py runserver

# Frontend development
cd algovision-frontend
npm start

# Full stack development
docker-compose up --build
```

#### Production Deployment
- **Backend** - Django production server (Gunicorn/uWSGI)
- **Frontend** - Static file hosting (Vercel/Netlify)
- **Database** - PostgreSQL/MySQL for production
- **CDN** - Static asset acceleration

### 11. Key Features Implementation

#### Social Features
- **User Following** - Follow/unfollow system with counts
- **Post Interactions** - Like, save, and comment functionality
- **Profile Management** - User profile editing and display
- **Content Discovery** - Algorithm feed and user discovery

#### Content Management
- **Rich Text Posts** - Markdown support for algorithm explanations
- **Image Integration** - Automatic placeholder generation
- **Tagging System** - Content categorization
- **Search & Filter** - Content discovery tools

#### Messaging System
- **Private Conversations** - Direct user communication
- **Real-time Updates** - Message delivery and read status
- **Conversation Threading** - Organized message history

## Connectivity Summary

### Database Connectivity
- **Django ORM** - Object-relational mapping
- **SQLite** - Development database
- **Migration System** - Schema version control
- **Model Relationships** - Foreign keys and many-to-many

### API Connectivity
- **RESTful Design** - Standard HTTP methods
- **Session Authentication** - Cookie-based auth
- **CSRF Protection** - Security token validation
- **CORS Handling** - Cross-origin request support

### Frontend-Backend Integration
- **Axios HTTP Client** - API communication
- **Session Management** - Authentication state
- **Error Handling** - User-friendly error messages
- **Real-time Updates** - Immediate UI feedback

This architecture provides a robust, scalable, and maintainable foundation for the Thinkverse algorithm discussion platform, ensuring optimal performance, security, and user experience across all application layers.
