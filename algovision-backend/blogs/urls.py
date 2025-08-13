from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_post, name='create-post'),
    path('posts/', views.get_posts, name='get-posts'),
    path('<int:post_id>/', views.get_post, name='get-post'),
    path('user/<int:user_id>/posts/', views.get_user_posts, name='get-user-posts'),
    path('<int:post_id>/like/', views.toggle_like, name='toggle-like'),
    path('<int:post_id>/replies/', views.get_post_replies, name='get-post-replies'),
    path('<int:post_id>/save/', views.toggle_save_post, name='toggle-save-post'),
    path('saved/', views.get_saved_posts, name='get-saved-posts'),
    # New endpoints for profile sections
    path('user/<str:username>/likes/', views.get_user_liked_posts, name='get-user-liked-posts'),
    path('user/<str:username>/replies/', views.get_user_replies, name='get-user-replies'),
    path('user/<str:username>/media/', views.get_user_media_posts, name='get-user-media-posts'),
]
