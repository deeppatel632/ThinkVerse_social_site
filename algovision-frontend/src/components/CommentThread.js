import React, { useState } from 'react';
import { Heart, MessageCircle, Reply, MoreVertical } from 'lucide-react';

const CommentThread = ({ comment, onReply, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleReply = () => {
    onReply(comment.id);
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
        {/* Comment header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {comment.author?.username || 'Anonymous'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.created_at)}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Comment content */}
        <div className="text-gray-700 dark:text-gray-300 text-sm mb-3">
          {comment.content}
        </div>

        {/* Comment actions */}
        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{comment.likes_count || 0}</span>
          </button>
          
          <button
            onClick={handleReply}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Reply size={14} />
            <span>Reply</span>
          </button>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {depth < 2 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
            >
              {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
            </button>
          )}
          
          {showReplies && (
            <div className="space-y-2">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentThread; 