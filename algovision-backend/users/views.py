from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.middleware.csrf import get_token
from .models import User, Follow, BlockedUser, UserActivity
import json

@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for frontend"""
    return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        location = data.get('location', '')
        
        if not username or not email or not password:
            return JsonResponse({
                'error': 'Username, email, and password are required'
            }, status=400)
        
        # Enhanced validation
        if len(password) < 8:
            return JsonResponse({
                'error': 'Password must be at least 8 characters long'
            }, status=400)
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'error': 'Username already exists'
            }, status=400)
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'error': 'Email already exists'
            }, status=400)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.full_name = full_name
        user.location = location
        user.save()
        
        # Log user activity
        UserActivity.objects.create(
            user=user,
            activity_type='login',
            data={'registration': True}
        )
        
        login(request, user)
        
        return JsonResponse({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'location': user.location
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON'
        }, status=400)
    except (ValueError, TypeError) as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({
                'error': 'Username and password are required'
            }, status=400)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Update last active and log activity
            user.update_last_active()
            UserActivity.objects.create(
                user=user,
                activity_type='login'
            )
            
            return JsonResponse({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name
                }
            })
        
        return JsonResponse({
            'error': 'Invalid credentials'
        }, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON'
        }, status=400)
    except (ValueError, TypeError) as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    if request.user.is_authenticated:
        # Log logout activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='logout'
        )
    
    logout(request)
    return JsonResponse({
        'message': 'Logout successful'
    })

@login_required
def user_profile_view(request, username=None):
    if username:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        user = request.user
    
    is_own_profile = user == request.user
    is_following = False
    is_blocked = False
    mutual_followers_count = 0
    
    if not is_own_profile:
        is_following = request.user.is_following(user)
        is_blocked = BlockedUser.objects.filter(
            blocker=request.user, blocked=user
        ).exists() or BlockedUser.objects.filter(
            blocker=user, blocked=request.user
        ).exists()
        mutual_followers_count = request.user.get_mutual_followers(user).count()
    
    # Get post counts
    from blogs.models import Blog, SavedPost
    posts_count = Blog.objects.filter(author=user, is_reply=False).count()
    replies_count = Blog.objects.filter(author=user, is_reply=True).count()
    likes_count = Blog.objects.filter(likes=user).count()
    media_count = Blog.objects.filter(
        author=user, 
        media_type__in=['image', 'video', 'gif']
    ).exclude(media_type='none').count()
    saved_count = SavedPost.objects.filter(user=user).count() if is_own_profile else 0
    
    return JsonResponse({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email if is_own_profile else None,
            'full_name': user.full_name,
            'bio': user.bio,
            'location': user.location,
            'website': user.website,
            'avatar': user.avatar,
            'date_joined': user.date_joined.isoformat(),
            'last_active': user.last_active.isoformat(),
            'is_verified': user.is_verified,
            'is_private': user.is_private,
            'followers_count': user.get_followers_count(),
            'following_count': user.get_following_count(),
            'posts_count': posts_count,
            'replies_count': replies_count,
            'likes_count': likes_count,
            'media_count': media_count,
            'saved_count': saved_count,
            'is_following': is_following,
            'is_own_profile': is_own_profile,
            'is_blocked': is_blocked,
            'mutual_followers_count': mutual_followers_count
        }
    })

@csrf_exempt
def check_auth_view(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'full_name': request.user.full_name
            }
        })
    
    return JsonResponse({
        'authenticated': False
    })

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def toggle_follow_view(request, username):
    """Enhanced follow/unfollow functionality"""
    try:
        user_to_follow = User.objects.get(username=username)
        
        if user_to_follow == request.user:
            return JsonResponse({'error': 'Cannot follow yourself'}, status=400)
        
        # Check if blocked
        if BlockedUser.objects.filter(
            Q(blocker=request.user, blocked=user_to_follow) |
            Q(blocker=user_to_follow, blocked=request.user)
        ).exists():
            return JsonResponse({'error': 'Cannot follow blocked user'}, status=400)
        
        follow = Follow.objects.filter(
            follower=request.user,
            followed=user_to_follow
        ).first()
        
        if follow:
            # Unfollow
            follow.delete()
            is_following = False
            action = 'unfollowed'
        else:
            # Follow
            Follow.objects.create(
                follower=request.user,
                followed=user_to_follow
            )
            is_following = True
            action = 'followed'
            
            # Log activity
            UserActivity.objects.create(
                user=request.user,
                activity_type='user_followed',
                data={'followed_user_id': user_to_follow.id}
            )
        
        return JsonResponse({
            'message': f'Successfully {action} user',
            'is_following': is_following,
            'followers_count': user_to_follow.get_followers_count()
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

# Keep the original follow/unfollow views for backward compatibility
@csrf_exempt
@login_required
@require_http_methods(["POST"])
def follow_user_view(request, username):
    try:
        user_to_follow = User.objects.get(username=username)
        
        if user_to_follow == request.user:
            return JsonResponse({'error': 'Cannot follow yourself'}, status=400)
        
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            followed=user_to_follow
        )
        
        if not created:
            return JsonResponse({'error': 'Already following this user'}, status=400)
        
        return JsonResponse({
            'message': 'Successfully followed user',
            'followers_count': user_to_follow.get_followers_count()
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def unfollow_user_view(request, username):
    try:
        user_to_unfollow = User.objects.get(username=username)
        
        follow = Follow.objects.filter(
            follower=request.user,
            followed=user_to_unfollow
        ).first()
        
        if not follow:
            return JsonResponse({'error': 'Not following this user'}, status=400)
        
        follow.delete()
        
        return JsonResponse({
            'message': 'Successfully unfollowed user',
            'followers_count': user_to_unfollow.get_followers_count()
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
@require_http_methods(["PUT"])
def update_profile_view(request):
    # Check if user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({
            'error': 'Authentication required',
            'message': 'Please log in to update your profile'
        }, status=401)
    
    try:
        data = json.loads(request.body)
        user = request.user
        
        # Update allowed fields
        if 'bio' in data:
            user.bio = data['bio']
        if 'location' in data:
            user.location = data['location']
        if 'website' in data:
            user.website = data['website']
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'is_private' in data:
            user.is_private = data['is_private']
        
        user.save()
        
        # Log activity
        UserActivity.objects.create(
            user=user,
            activity_type='profile_updated'
        )
        
        return JsonResponse({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'bio': user.bio,
                'location': user.location,
                'website': user.website,
                'avatar': user.avatar,
                'is_private': user.is_private,
                'date_joined': user.date_joined.isoformat(),
                'followers_count': user.get_followers_count(),
                'following_count': user.get_following_count(),
                'is_own_profile': True
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def search_users_view(request):
    """Search for users by username, full name, or bio"""
    query = request.GET.get('q', '').strip()
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 20))
    
    if not query:
        return JsonResponse({'error': 'Search query required'}, status=400)
    
    # Search in username, full_name, and bio
    users = User.objects.filter(
        Q(username__icontains=query) |
        Q(full_name__icontains=query) |
        Q(bio__icontains=query)
    ).exclude(id=request.user.id).order_by('-last_active')
    
    paginator = Paginator(users, limit)
    page_obj = paginator.get_page(page)
    
    users_data = []
    for user in page_obj:
        users_data.append({
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'bio': user.bio[:100] + '...' if len(user.bio) > 100 else user.bio,
            'avatar': user.avatar,
            'is_verified': user.is_verified,
            'followers_count': user.get_followers_count(),
            'is_following': request.user.is_following(user),
            'mutual_followers_count': request.user.get_mutual_followers(user).count()
        })
    
    return JsonResponse({
        'users': users_data,
        'pagination': {
            'current_page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_count': paginator.count
        }
    })

@login_required
def get_followers_view(request, username):
    """Get followers list for a user"""
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 20))
    
    followers = User.objects.filter(
        following__followed=user
    ).order_by('-following__created_at')
    
    paginator = Paginator(followers, limit)
    page_obj = paginator.get_page(page)
    
    followers_data = []
    for follower in page_obj:
        followers_data.append({
            'id': follower.id,
            'username': follower.username,
            'full_name': follower.full_name,
            'avatar': follower.avatar,
            'is_verified': follower.is_verified,
            'is_following': request.user.is_following(follower),
            'followers_count': follower.get_followers_count()
        })
    
    return JsonResponse({
        'followers': followers_data,
        'pagination': {
            'current_page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_count': paginator.count
        }
    })

@login_required
def get_following_view(request, username):
    """Get following list for a user"""
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 20))
    
    following = User.objects.filter(
        followers__follower=user
    ).order_by('-followers__created_at')
    
    paginator = Paginator(following, limit)
    page_obj = paginator.get_page(page)
    
    following_data = []
    for followed_user in page_obj:
        following_data.append({
            'id': followed_user.id,
            'username': followed_user.username,
            'full_name': followed_user.full_name,
            'avatar': followed_user.avatar,
            'is_verified': followed_user.is_verified,
            'is_following': request.user.is_following(followed_user),
            'followers_count': followed_user.get_followers_count()
        })
    
    return JsonResponse({
        'following': following_data,
        'pagination': {
            'current_page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_count': paginator.count
        }
    })

@login_required
def get_suggested_users_view(request):
    """Get suggested users to follow"""
    limit = int(request.GET.get('limit', 10))
    suggested_users = request.user.get_suggested_users(limit)
    
    suggestions_data = []
    for user in suggested_users:
        suggestions_data.append({
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'bio': user.bio[:100] + '...' if len(user.bio) > 100 else user.bio,
            'avatar': user.avatar,
            'is_verified': user.is_verified,
            'followers_count': user.get_followers_count(),
            'mutual_followers_count': request.user.get_mutual_followers(user).count()
        })
    
    return JsonResponse({
        'suggested_users': suggestions_data
    })

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def block_user_view(request, username):
    """Block a user"""
    try:
        user_to_block = User.objects.get(username=username)
        
        if user_to_block == request.user:
            return JsonResponse({'error': 'Cannot block yourself'}, status=400)
        
        # Remove any existing follow relationships
        Follow.objects.filter(
            Q(follower=request.user, followed=user_to_block) |
            Q(follower=user_to_block, followed=request.user)
        ).delete()
        
        # Create block relationship
        blocked, created = BlockedUser.objects.get_or_create(
            blocker=request.user,
            blocked=user_to_block
        )
        
        if not created:
            return JsonResponse({'error': 'User already blocked'}, status=400)
        
        return JsonResponse({
            'message': 'User blocked successfully'
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def unblock_user_view(request, username):
    """Unblock a user"""
    try:
        user_to_unblock = User.objects.get(username=username)
        
        blocked = BlockedUser.objects.filter(
            blocker=request.user,
            blocked=user_to_unblock
        ).first()
        
        if not blocked:
            return JsonResponse({'error': 'User not blocked'}, status=400)
        
        blocked.delete()
        
        return JsonResponse({
            'message': 'User unblocked successfully'
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@login_required
def get_user_activity_view(request):
    """Get current user's activity history"""
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 20))
    
    activities = UserActivity.objects.filter(
        user=request.user
    ).order_by('-timestamp')
    
    paginator = Paginator(activities, limit)
    page_obj = paginator.get_page(page)
    
    activities_data = []
    for activity in page_obj:
        activities_data.append({
            'id': activity.id,
            'activity_type': activity.activity_type,
            'timestamp': activity.timestamp.isoformat(),
            'data': activity.data
        })
    
    return JsonResponse({
        'activities': activities_data,
        'pagination': {
            'current_page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_count': paginator.count
        }
    })
