import React from 'react';
import UserSearch from '../components/UserSearch';
import { Search, TrendingUp } from 'lucide-react';

const UserDiscovery = () => {
  return (
    <div className="flex-1 max-w-2xl mx-auto min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center px-4 py-3">
          <div className="flex items-center space-x-3">
            <Search size={24} className="text-gray-700 dark:text-gray-300" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Discover People
            </h1>
          </div>
        </div>
      </div>

      {/* User Search Component */}
      <UserSearch />

      {/* Popular Users Section - Could be added later */}
      {/* 
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={20} className="text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Popular This Week
          </h2>
        </div>
      </div>
      */}
    </div>
  );
};

export default UserDiscovery;
