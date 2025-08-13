from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Blog, SavedPost
import json

# Create a new post
@csrf_exempt
@require_http_methods(["POST"])
def create_post(request):
    # Check authentication
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Authentication required'}, status=401)
    
    try:
        # Debug: Print request body
        print(f"Request body: {request.body}")
        data = json.loads(request.body)
        print(f"Parsed data: {data}")
        
        # Validate required fields
        if 'content' not in data or not data['content'].strip():
            return JsonResponse({'success': False, 'error': 'Content is required'}, status=400)
        
        # Create new post
        post = Blog.objects.create(
            title=data.get('title', ''),
            content=data['content'],
            author=request.user,
            image_url=data.get('image_url', ''),
            media_type=data.get('media_type', 'none'),
            is_reply=data.get('is_reply', False),
            parent_post_id=data.get('parent_post_id', None)
        )
        
        # Handle tags
        if 'tags' in data:
            post.set_tags(data['tags'])
            post.save()
        
        print(f"Post created successfully: {post.id}")
        
        return JsonResponse({
            'success': True,
            'post': {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'likes_count': post.likes_count,
                'replies_count': post.replies_count,
                'comments_count': post.comments_count,
                'image_url': post.get_image_url(),  # Use the method with fallback
                'media_type': post.media_type,
                'tags': post.tags_list,
                'is_reply': post.is_reply,
                'parent_post_id': post.parent_post.id if post.parent_post else None,
                'is_liked': False
            }
        })
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print(f"General error in create_post: {e}")
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# Get all posts for timeline
@require_http_methods(["GET"])
def get_posts(request):
    try:
        posts = Blog.objects.filter(is_reply=False).select_related('author').prefetch_related('likes')
        posts_data = []
        
        for post in posts:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'likes_count': post.likes_count,
                'replies_count': post.replies_count,
                'comments_count': post.comments_count,
                'image_url': post.get_image_url(),  # Use the method with fallback
                'media_type': post.media_type,
                'tags': post.tags_list,
                'is_liked': post.is_liked_by(request.user) if request.user.is_authenticated else False,
                'is_saved': post.is_saved_by(request.user) if request.user.is_authenticated else False
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Get a single post by ID
@require_http_methods(["GET"])
def get_post(request, post_id):
    try:
        post = get_object_or_404(Blog, id=post_id)
        
        post_data = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': {
                'id': post.author.id,
                'username': post.author.username,
                'avatar': post.author.avatar or '/default-avatar.png'
            },
            'created_at': post.created_at.isoformat(),
            'likes_count': post.likes_count,
            'replies_count': post.replies_count,
            'comments_count': post.comments_count,
            'image_url': post.get_image_url(),
            'media_type': post.media_type,
            'tags': post.tags_list,
            'is_reply': post.is_reply,
            'parent_post_id': post.parent_post.id if post.parent_post else None,
            'is_liked': post.is_liked_by(request.user) if request.user.is_authenticated else False,
            'is_saved': post.is_saved_by(request.user) if request.user.is_authenticated else False
        }
        
        return JsonResponse({'post': post_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Get user's posts for profile
@require_http_methods(["GET"])
def get_user_posts(request, user_id):
    try:
        posts = Blog.objects.filter(author_id=user_id, is_reply=False).select_related('author').prefetch_related('likes')
        posts_data = []
        
        for post in posts:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'likes_count': post.likes_count,
                'replies_count': post.replies_count,
                'comments_count': post.comments_count,
                'image_url': post.get_image_url(),
                'media_type': post.media_type,
                'tags': post.tags_list,
                'is_liked': post.is_liked_by(request.user) if request.user.is_authenticated else False
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Like/Unlike a post
@csrf_exempt
@require_http_methods(["POST"])
def toggle_like(request, post_id):
    # Check authentication
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Authentication required'}, status=401)
    
    try:
        post = get_object_or_404(Blog, id=post_id)
        
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
            is_liked = False
        else:
            post.likes.add(request.user)
            is_liked = True
        
        return JsonResponse({
            'success': True,
            'is_liked': is_liked,
            'likes_count': post.likes_count
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# Get replies for a post
@require_http_methods(["GET"])
def get_post_replies(request, post_id):
    try:
        replies = Blog.objects.filter(parent_post_id=post_id, is_reply=True).select_related('author').prefetch_related('likes')
        replies_data = []
        
        for reply in replies:
            replies_data.append({
                'id': reply.id,
                'content': reply.content,
                'author': {
                    'id': reply.author.id,
                    'username': reply.author.username,
                    'avatar': reply.author.avatar or '/default-avatar.png'
                },
                'created_at': reply.created_at.isoformat(),
                'likes_count': reply.likes_count,
                'is_liked': reply.is_liked_by(request.user) if request.user.is_authenticated else False
            })
        
        return JsonResponse({'replies': replies_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Save/unsave a post
@csrf_exempt
@require_http_methods(["POST"])
def toggle_save_post(request, post_id):
    # Check authentication
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Authentication required'}, status=401)
    
    try:
        post = get_object_or_404(Blog, id=post_id)
        
        saved_post, created = SavedPost.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            # If already saved, remove it
            saved_post.delete()
            is_saved = False
        else:
            is_saved = True
        
        return JsonResponse({
            'success': True,
            'is_saved': is_saved
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


# Get user's saved posts
@require_http_methods(["GET"])
def get_saved_posts(request):
    # Check authentication
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Authentication required'}, status=401)
    
    try:
        saved_posts = SavedPost.objects.filter(user=request.user).select_related('post__author').prefetch_related('post__likes')
        posts_data = []
        
        for saved_post in saved_posts:
            post = saved_post.post
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'saved_at': saved_post.saved_at.isoformat(),
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'is_liked': post.is_liked_by(request.user),
                'is_saved': True,
                'image_url': post.get_image_url(),
                'media_type': post.media_type,
                'tags': post.tags_list
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Get user's liked posts
@require_http_methods(["GET"])
def get_user_liked_posts(request, username):
    try:
        from users.models import User
        user = get_object_or_404(User, username=username)
        
        liked_posts = Blog.objects.filter(likes=user).select_related('author').prefetch_related('likes')
        posts_data = []
        
        for post in liked_posts:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'full_name': post.author.full_name,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'is_liked': post.is_liked_by(request.user) if request.user.is_authenticated else False,
                'is_saved': post.is_saved_by(request.user) if request.user.is_authenticated else False,
                'image_url': post.image_url,
                'media_type': post.media_type,
                'tags': post.tags_list,
                'is_reply': post.is_reply,
                'parent_post_id': post.parent_post.id if post.parent_post else None
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Get user's replies
@require_http_methods(["GET"])  
def get_user_replies(request, username):
    try:
        from users.models import User
        user = get_object_or_404(User, username=username)
        
        replies = Blog.objects.filter(author=user, is_reply=True).select_related('author', 'parent_post__author').prefetch_related('likes')
        posts_data = []
        
        for reply in replies:
            posts_data.append({
                'id': reply.id,
                'title': reply.title,
                'content': reply.content,
                'author': {
                    'id': reply.author.id,
                    'username': reply.author.username,
                    'full_name': reply.author.full_name,
                    'avatar': reply.author.avatar or '/default-avatar.png'
                },
                'created_at': reply.created_at.isoformat(),
                'likes_count': reply.likes_count,
                'comments_count': reply.comments_count,
                'is_liked': reply.is_liked_by(request.user) if request.user.is_authenticated else False,
                'is_saved': reply.is_saved_by(request.user) if request.user.is_authenticated else False,
                'image_url': reply.image_url,
                'media_type': reply.media_type,
                'tags': reply.tags_list,
                'is_reply': True,
                'parent_post': {
                    'id': reply.parent_post.id,
                    'content': reply.parent_post.content[:100] + '...' if len(reply.parent_post.content) > 100 else reply.parent_post.content,
                    'author': {
                        'username': reply.parent_post.author.username,
                        'full_name': reply.parent_post.author.full_name
                    }
                } if reply.parent_post else None
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Get user's media posts
@require_http_methods(["GET"])
def get_user_media_posts(request, username):
    try:
        from users.models import User
        user = get_object_or_404(User, username=username)
        
        media_posts = Blog.objects.filter(
            author=user, 
            media_type__in=['image', 'video', 'gif']
        ).exclude(media_type='none').select_related('author').prefetch_related('likes')
        
        posts_data = []
        
        for post in media_posts:
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': {
                    'id': post.author.id,
                    'username': post.author.username,
                    'full_name': post.author.full_name,
                    'avatar': post.author.avatar or '/default-avatar.png'
                },
                'created_at': post.created_at.isoformat(),
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'is_liked': post.is_liked_by(request.user) if request.user.is_authenticated else False,
                'is_saved': post.is_saved_by(request.user) if request.user.is_authenticated else False,
                'image_url': post.image_url,
                'media_type': post.media_type,
                'tags': post.tags_list,
                'is_reply': post.is_reply,
                'parent_post_id': post.parent_post.id if post.parent_post else None
            })
        
        return JsonResponse({'posts': posts_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
