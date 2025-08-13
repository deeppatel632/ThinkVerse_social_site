import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/users';
import { Users, UserPlus, UserMinus, CheckCircle, X } from 'lucide-react';

const FollowersFollowing = ({ username, type = 'followers', onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers(1);
  }, [username, type]);

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      let response;
      if (type === 'followers') {
        response = await usersAPI.getFollowers(username, page);
      } else {
        response = await usersAPI.getFollowing(username, page);
      }
      
      // Use the correct key based on type
      const userData = type === 'followers' ? response.followers : response.following;
      
      if (page === 1) {
        setUsers(userData || []);
      } else {
        setUsers(prev => [...(prev || []), ...(userData || [])]);
      }
      
      setPagination(response.pagination || null);
      setCurrentPage(page);
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (user) => {
    try {
      const response = await usersAPI.toggleFollow(user.username);
      
      setUsers(prev => 
        (prev || []).map(u => 
          u.id === user.id 
            ? { ...u, is_following: response.is_following }
            : u
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleBlock = async (user) => {
    try {
      await usersAPI.blockUser(user.username);
      setUsers(prev => (prev || []).filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const UserCard = ({ user }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Users size={12} />
              <span>{user.followers_count} followers</span>
            </span>
            {user.mutual_followers_count > 0 && (
              <span>{user.mutual_followers_count} mutual</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleFollowToggle(user)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1 text-sm ${
            user.is_following
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {user.is_following ? (
            <>
              <UserMinus size={14} />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={14} />
              <span>Follow</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => handleBlock(user)}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Block user"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (!users || users.length === 0) ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
          ) : (!users || users.length === 0) ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">
                {type === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'
                }
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
              
              {pagination && pagination.has_next && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => loadUsers(currentPage + 1)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowing;
