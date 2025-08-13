import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Hash, User, LogOut, Sun, Moon, Bookmark, Search, MessageCircle } from 'lucide-react';

const Sidebar = ({ darkMode, toggleDarkMode, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Hash, label: 'Explore' },
    { path: '/discover', icon: Search, label: 'Discover People' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 overflow-hidden sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Thinkverse
        </h1>
      </div>

      {/* Navigation */}
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
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-medium">
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 