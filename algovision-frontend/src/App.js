import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BlogDetails from './pages/BlogDetails';
import SavedPosts from './pages/SavedPosts';
import Messages from './pages/Messages';
import UserDiscovery from './pages/UserDiscovery';
import { authAPI } from './api/auth';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await authAPI.isAuthenticated();
        if (response && response.authenticated && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('User not authenticated');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show auth pages
  if (!user) {
    return (
      <Router>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
        <div className="flex">
          {/* Sidebar */}
          <div className={`${showSidebar ? 'block' : 'hidden'} lg:block`}>
            <Sidebar
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </div>

          {/* Overlay for mobile sidebar */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar onMenuToggle={toggleSidebar} showSidebar={showSidebar} />

          {/* Page Content */}
          <main className="flex-1 flex">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/discover" element={<UserDiscovery />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/saved" element={<SavedPosts />} />
                <Route path="/profile/:username?" element={<Profile />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 