from django.urls import path
from . import views

app_name = 'messaging'

urlpatterns = [
    path('conversations/', views.get_conversations, name='get_conversations'),
    path('start/<str:username>/', views.start_conversation, name='start_conversation'),
    path('conversation/<int:conversation_id>/messages/', views.get_messages, name='get_messages'),
    path('conversation/<int:conversation_id>/send/', views.send_message, name='send_message'),
]
