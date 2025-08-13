#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/Users/name/CLG/CLG_Project/SEM_4 copy/algovision-backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from blogs.models import Blog
import random

def create_test_content():
    """Create some test content including media posts, replies, and likes"""
    
    # Get some users
    users = list(User.objects.all()[:8])
    
    if len(users) < 2:
        print("Need at least 2 users to create test content")
        return
    
    # Sample media posts content
    media_posts = [
        {
            'content': 'Here\'s a visual representation of the sorting algorithm complexity! 📊',
            'media_type': 'image',
            'image_url': 'https://via.placeholder.com/600x400/4CAF50/white?text=Algorithm+Complexity+Chart'
        },
        {
            'content': 'Check out this amazing data structure visualization! 🔗',
            'media_type': 'image', 
            'image_url': 'https://via.placeholder.com/600x400/2196F3/white?text=Binary+Tree+Visualization'
        },
        {
            'content': 'Live coding session recording - implementing a graph traversal algorithm 🎥',
            'media_type': 'video',
            'image_url': 'https://via.placeholder.com/600x400/FF5722/white?text=Video+Thumbnail'
        },
        {
            'content': 'Quick animation showing how bubble sort works! 📱',
            'media_type': 'gif',
            'image_url': 'https://via.placeholder.com/400x300/9C27B0/white?text=Bubble+Sort+GIF'
        },
        {
            'content': 'My workspace setup for competitive programming 💻',
            'media_type': 'image',
            'image_url': 'https://via.placeholder.com/600x400/607D8B/white?text=Coding+Setup'
        }
    ]
    
    # Sample reply content
    reply_contents = [
        "Great explanation! This really helped me understand the concept.",
        "I have a question about the time complexity analysis here.",
        "This is exactly what I was looking for. Thanks for sharing!",
        "Could you explain the edge case handling in more detail?",
        "Brilliant solution! I never thought of this approach.",
        "This implementation is so clean and readable.",
        "I tried this approach but got stuck at the optimization part.",
        "Perfect timing! I was just working on a similar problem."
    ]
    
    print("Creating media posts...")
    
    # Create media posts
    for i, media_post in enumerate(media_posts):
        user = users[i % len(users)]
        Blog.objects.create(
            title=f"Media Post {i+1}",
            content=media_post['content'],
            author=user,
            media_type=media_post['media_type'],
            image_url=media_post['image_url']
        )
        print(f"Created media post {i+1} by {user.username}")
    
    print("\nCreating replies...")
    
    # Get some existing posts to reply to
    existing_posts = list(Blog.objects.filter(is_reply=False)[:6])
    
    # Create replies
    for i, reply_content in enumerate(reply_contents[:6]):
        if i < len(existing_posts):
            user = users[(i + 2) % len(users)]  # Different users for replies
            parent_post = existing_posts[i]
            
            Blog.objects.create(
                content=reply_content,
                author=user,
                is_reply=True,
                parent_post=parent_post
            )
            print(f"Created reply by {user.username} to post by {parent_post.author.username}")
    
    print("\nAdding likes to posts...")
    
    # Add some likes to posts
    all_posts = list(Blog.objects.all())
    for post in all_posts[:10]:  # Like first 10 posts
        # Each post gets liked by 2-4 random users
        num_likes = random.randint(2, 4)
        likers = random.sample(users, min(num_likes, len(users)))
        
        for liker in likers:
            if not post.likes.filter(id=liker.id).exists():
                post.likes.add(liker)
        
        print(f"Post by {post.author.username} now has {post.likes.count()} likes")
    
    print("\nTest content created successfully!")
    print(f"Total posts: {Blog.objects.filter(is_reply=False).count()}")
    print(f"Total replies: {Blog.objects.filter(is_reply=True).count()}")
    print(f"Total media posts: {Blog.objects.exclude(media_type='none').count()}")

if __name__ == '__main__':
    create_test_content()
