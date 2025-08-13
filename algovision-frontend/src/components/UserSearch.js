import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../api/users';
import { Search, UserPlus, UserMinus, Users, CheckCircle } from 'lucide-react';
import { debounce } from 'lodash';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await usersAPI.searchUsers(query);
        setSearchResults(response.users);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Load suggested users on component mount
  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        const response = await usersAPI.getSuggestedUsers();
        setSuggestedUsers(response.suggested_users);
      } catch (error) {
        console.error('Error loading suggested users:', error);
      }
    };

    loadSuggestedUsers();
  }, []);

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleFollowToggle = async (user) => {
    try {
      const response = await usersAPI.toggleFollow(user.username);
      
      // Update search results
      setSearchResults(prev => 
        prev.map(u => 
          u.id === user.id 
            ? { ...u, is_following: response.is_following }
            : u
        )
      );

      // Update suggested users
      setSuggestedUsers(prev => 
        prev.map(u => 
          u.id === user.id 
            ? { ...u, is_following: response.is_following }
            : u
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const UserCard = ({ user, showMutualFollowers = false }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          {user.is_verified && (
            <CheckCircle 
              size={16} 
              className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full"
            />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {user.full_name || user.username}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {user.bio}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Users size={12} />
              <span>{user.followers_count} followers</span>
            </span>
            {showMutualFollowers && user.mutual_followers_count > 0 && (
              <span>{user.mutual_followers_count} mutual</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleFollowToggle(user)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
          user.is_following
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {user.is_following ? (
          <>
            <UserMinus size={16} />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Follow</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by username, name, or bio..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-400">Searching...</div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Results
          </h2>
          <div className="space-y-3">
            {searchResults.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                showMutualFollowers={true}
              />
            ))}
          </div>
          
          {pagination && pagination.has_next && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  // Load more results logic would go here
                  console.log('Load more results');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Suggested Users */}
      {suggestedUsers.length > 0 && searchQuery.trim() === '' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Suggested for You
          </h2>
          <div className="space-y-3">
            {suggestedUsers.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                showMutualFollowers={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery.trim().length >= 2 && searchResults.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-400">
            No users found for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
