from django.urls import path
from . import views

urlpatterns = [
    path('', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('<int:pk>/like/', views.CommentLikeView.as_view(), name='comment-like'),
    path('blog/<int:blog_id>/', views.BlogCommentsView.as_view(), name='blog-comments'),
]
