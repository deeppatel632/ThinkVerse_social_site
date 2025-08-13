from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # CSRF token endpoint
    path('csrf/', views.get_csrf_token, name='csrf_token'),
    
    # Auth endpoints
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/check/', views.check_auth_view, name='check_auth'),
    
    # User profile endpoints
    path('profile/', views.user_profile_view, name='user_profile'),
    path('profile/<str:username>/', views.user_profile_view, name='user_profile_by_username'),
    path('profile/update/', views.update_profile_view, name='update_profile'),
    
    # Follow/Unfollow endpoints
    path('follow/<str:username>/', views.follow_user_view, name='follow_user'),
    path('unfollow/<str:username>/', views.unfollow_user_view, name='unfollow_user'),
    path('toggle-follow/<str:username>/', views.toggle_follow_view, name='toggle_follow'),
    
    # User discovery and social features
    path('search/', views.search_users_view, name='search_users'),
    path('<str:username>/followers/', views.get_followers_view, name='get_followers'),
    path('<str:username>/following/', views.get_following_view, name='get_following'),
    path('suggestions/', views.get_suggested_users_view, name='get_suggested_users'),
    
    # Block/Unblock functionality
    path('block/<str:username>/', views.block_user_view, name='block_user'),
    path('unblock/<str:username>/', views.unblock_user_view, name='unblock_user'),
    
    # User activity
    path('activity/', views.get_user_activity_view, name='get_user_activity'),
] 