from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import Conversation, Message, MessageRead
from users.models import User
import json

@login_required
@require_http_methods(["GET"])
def get_conversations(request):
    """Get all conversations for the current user"""
    try:
        conversations = Conversation.objects.filter(
            participants=request.user
        ).prefetch_related('participants', 'messages')
        
        conversations_data = []
        for conv in conversations:
            other_participant = conv.get_other_participant(request.user)
            last_message = conv.last_message
            
            conversations_data.append({
                'id': conv.id,
                'other_participant': {
                    'id': other_participant.id,
                    'username': other_participant.username,
                    'full_name': other_participant.full_name,
                    'avatar': other_participant.avatar or '/default-avatar.png'
                },
                'last_message': {
                    'content': last_message.content if last_message else '',
                    'created_at': last_message.created_at.isoformat() if last_message else '',
                    'sender_username': last_message.sender.username if last_message else ''
                } if last_message else None,
                'created_at': conv.created_at.isoformat(),
                'updated_at': conv.updated_at.isoformat()
            })
        
        return JsonResponse({'conversations': conversations_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_http_methods(["POST"])
def start_conversation(request, username):
    """Start a new conversation with a user"""
    try:
        other_user = get_object_or_404(User, username=username)
        
        # Check if conversation already exists
        existing_conv = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=other_user
        ).first()
        
        if existing_conv:
            return JsonResponse({
                'conversation_id': existing_conv.id,
                'message': 'Conversation already exists'
            })
        
        # Create new conversation
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, other_user)
        
        return JsonResponse({
            'conversation_id': conversation.id,
            'message': 'Conversation created successfully'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_http_methods(["GET"])
def get_messages(request, conversation_id):
    """Get messages for a specific conversation"""
    try:
        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Check if user is participant
        if not conversation.participants.filter(id=request.user.id).exists():
            return JsonResponse({'error': 'Access denied'}, status=403)
        
        messages = Message.objects.filter(
            conversation=conversation
        ).select_related('sender').order_by('created_at')
        
        messages_data = []
        for message in messages:
            messages_data.append({
                'id': message.id,
                'content': message.content,
                'sender': {
                    'id': message.sender.id,
                    'username': message.sender.username,
                    'full_name': message.sender.full_name,
                    'avatar': message.sender.avatar or '/default-avatar.png'
                },
                'created_at': message.created_at.isoformat(),
                'is_read': message.is_read
            })
        
        # Mark messages as read
        unread_messages = messages.exclude(
            read_by__user=request.user
        ).exclude(sender=request.user)
        
        for msg in unread_messages:
            MessageRead.objects.get_or_create(
                message=msg,
                user=request.user
            )
        
        return JsonResponse({'messages': messages_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def send_message(request, conversation_id):
    """Send a message in a conversation"""
    try:
        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Check if user is participant
        if not conversation.participants.filter(id=request.user.id).exists():
            return JsonResponse({'error': 'Access denied'}, status=403)
        
        data = json.loads(request.body)
        content = data.get('content', '').strip()
        
        if not content:
            return JsonResponse({'error': 'Message content is required'}, status=400)
        
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )
        
        # Update conversation timestamp
        conversation.save()
        
        return JsonResponse({
            'message': {
                'id': message.id,
                'content': message.content,
                'sender': {
                    'id': message.sender.id,
                    'username': message.sender.username,
                    'full_name': message.sender.full_name,
                    'avatar': message.sender.avatar or '/default-avatar.png'
                },
                'created_at': message.created_at.isoformat(),
                'is_read': message.is_read
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
