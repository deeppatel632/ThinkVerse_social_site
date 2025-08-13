import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const BlogCard = ({ blog, onLike, onSave }) => {
  const {
    id,
    title,
    content,
    author,
    created_at,
    likes_count,
    comments_count,
    replies_count,
    tags = [],
    image_url,
    is_liked = false,
    is_saved = false
  } = blog;

  // Generate random placeholder image if no image_url exists
  const getImageUrl = () => {
    // Check if image_url exists and is not empty
    if (image_url && image_url.trim() !== '') {
      return image_url;
    }
    // Generate a random image from Picsum based on post ID for consistency
    return `https://picsum.photos/seed/${id}/600/300`;
  };

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
      {/* Author info */}
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

      {/* Content */}
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

      {/* Image - always show either original or placeholder */}
      <div className="mb-4">
        <img
          src={getImageUrl()}
          alt={title || 'Post image'}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            // If the image fails to load, use a fallback Picsum image
            if (e.target.src !== `https://picsum.photos/seed/${id}/600/300`) {
              e.target.src = `https://picsum.photos/seed/${id}/600/300`;
            }
          }}
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

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
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
          <Link
            to={`/blog/${id}`}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{(comments_count || 0) + (replies_count || 0)}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 