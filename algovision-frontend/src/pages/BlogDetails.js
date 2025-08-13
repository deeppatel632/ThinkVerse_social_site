import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import CommentThread from '../components/CommentThread';
import { Heart, MessageCircle, Bookmark, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Dummy blog data for demonstration
  const dummyBlog = {
    id: 1,
    title: 'Understanding Binary Search Trees',
    content: `# Understanding Binary Search Trees




Binary Search Trees are essential for understanding more complex data structures like AVL trees, Red-Black trees, and B-trees. They provide a good balance between simplicity and efficiency for many applications.`,
    author: { username: 'alex_coder', id: 1 },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    likes_count: 42,
    comments_count: 8,
    tags: ['algorithms', 'data-structures', 'python'],
    image_url: null,
  };

  const dummyComments = [
    {
      id: 1,
      content: 'Great explanation! I especially liked the code examples. Have you considered covering AVL trees next?',
      author: { username: 'sarah_dev', id: 2 },
      created_at: '2024-01-15T11:00:00Z',
      likes_count: 5,
      replies: [
        {
          id: 2,
          content: 'I second that! AVL trees would be a great follow-up.',
          author: { username: 'mike_tech', id: 3 },
          created_at: '2024-01-15T11:30:00Z',
          likes_count: 2,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      content: 'The time complexity section is very clear. This helped me understand why BSTs are so useful for database indexing.',
      author: { username: 'mike_tech', id: 3 },
      created_at: '2024-01-15T12:00:00Z',
      likes_count: 3,
      replies: [],
    },
    {
      id: 4,
      content: 'Could you add some visual diagrams to show the tree structure? That would make it even clearer.',
      author: { username: 'jane_developer', id: 4 },
      created_at: '2024-01-15T13:00:00Z',
      likes_count: 1,
      replies: [],
    },
  ];

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch the actual post data from API
        const postResponse = await postsAPI.getPost(id);
        setBlog(postResponse.post);
        setIsBookmarked(postResponse.post.is_saved || false);
        
        // Fetch replies/comments for the post
        const repliesResponse = await postsAPI.getPostReplies(id);
        setComments(repliesResponse.replies || []);
        
        setError(null);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

    const handleLike = async () => {
    try {
      if (!blog) return;
      
      const response = await postsAPI.toggleLike(blog.id);
      if (response.success) {
        setIsLiked(response.is_liked);
        setBlog(prev => ({
          ...prev,
          likes_count: response.likes_count,
          is_liked: response.is_liked
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (!blog) return;
      
      const response = await postsAPI.toggleSave(blog.id);
      if (response.success) {
        setIsBookmarked(response.is_saved);
        setBlog(prev => ({
          ...prev,
          is_saved: response.is_saved
        }));
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

    const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    
    try {
      const response = await postsAPI.createReply(id, newComment);
      if (response.success) {
        // Add the new comment to the list
        setComments(prev => [...prev, response.post]);
        setNewComment('');
        
        // Update the comments count
        setBlog(prev => ({
          ...prev,
          comments_count: prev.comments_count + 1,
          replies_count: prev.replies_count + 1
        }));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleReply = (commentId) => {
    // TODO: Implement reply functionality
    console.log('Reply to comment:', commentId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading blog...</div>
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

  if (!blog) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Blog Content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Blog Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {blog.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {blog.author?.username || 'Anonymous'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(blog.created_at)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Title - only show if it exists */}
          {blog.title && (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {blog.title}
            </h1>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {/* Blog Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                blog.is_liked
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart size={20} fill={blog.is_liked ? 'currentColor' : 'none'} />
              <span>{blog.likes_count}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <MessageCircle size={20} />
              <span>{blog.comments_count + blog.replies_count}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Comments ({blog.comments_count})
        </h3>

        {/* Add Comment */}
        <div className="mb-6">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails; 