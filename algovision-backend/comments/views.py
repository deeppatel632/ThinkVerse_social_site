from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

def get_dummy_comments(blog_id=None):
    comments = [
        {
            'id': 1,
            'content': 'Great explanation! I\'ve been struggling with BST implementation.',
            'author': {'username': 'john_dev', 'id': 4},
            'blog': 1,
            'parent': None,
            'created_at': '2024-01-15T11:30:00Z',
            'likes_count': 5,
            'replies_count': 2,
        },
        {
            'id': 2,
            'content': 'This helped me understand the concept much better. Thanks!',
            'author': {'username': 'jane_coder', 'id': 5},
            'blog': 1,
            'parent': 1,
            'created_at': '2024-01-15T12:00:00Z',
            'likes_count': 3,
            'replies_count': 0,
        },
    ]
    
    if blog_id:
        return [c for c in comments if c['blog'] == blog_id]
    return comments

class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        comments = get_dummy_comments()
        return Response({'results': comments, 'count': len(comments)})
    
    def post(self, request):
        return Response({'message': 'Comment created successfully'}, status=status.HTTP_201_CREATED)

class CommentDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, pk):
        comments = get_dummy_comments()
        comment = next((c for c in comments if c['id'] == pk), None)
        if not comment:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(comment)

class CommentLikeView(APIView):
    def post(self, request, pk):
        return Response({'message': 'Comment like toggled successfully'})

class BlogCommentsView(APIView):
    def get(self, request, blog_id):
        comments = get_dummy_comments(blog_id)
        return Response({'results': comments, 'count': len(comments)})
