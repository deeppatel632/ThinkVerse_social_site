from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db.models import Q

class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    last_active = models.DateTimeField(default=timezone.now)
    
    # Additional profile fields for a more complete social platform
    full_name = models.CharField(max_length=150, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return str(self.username)
    
    def get_followers_count(self):
        return self.followers.count()
    
    def get_following_count(self):
        return self.following.count()
    
    def is_following(self, user):
        return self.following.filter(followed=user).exists()
    
    def get_mutual_followers(self, user):
        """Get users that both current user and target user follow"""
        current_user_following = self.following.values_list('followed_id', flat=True)
        target_user_following = user.following.values_list('followed_id', flat=True)
        mutual_ids = set(current_user_following) & set(target_user_following)
        return User.objects.filter(id__in=mutual_ids)
    
    def get_suggested_users(self, limit=5):
        """Get suggested users to follow based on mutual connections and activity"""
        # Users followed by people you follow
        following_ids = self.following.values_list('followed_id', flat=True)
        suggestions = User.objects.filter(
            followers__follower_id__in=following_ids
        ).exclude(
            Q(id=self.id) | Q(id__in=following_ids)
        ).distinct().order_by('-last_active')[:limit]
        
        return suggestions
    
    def update_last_active(self):
        """Update the last active timestamp"""
        self.last_active = timezone.now()
        self.save(update_fields=['last_active'])

class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'followed')
        indexes = [
            models.Index(fields=['follower', 'created_at']),
            models.Index(fields=['followed', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"

class BlockedUser(models.Model):
    """Model to handle user blocking functionality"""
    blocker = models.ForeignKey(User, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(User, related_name='blocked_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('blocker', 'blocked')
    
    def __str__(self):
        return f"{self.blocker.username} blocked {self.blocked.username}"

class UserActivity(models.Model):
    """Track user activity for analytics and feed generation"""
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('post_created', 'Post Created'),
        ('post_liked', 'Post Liked'),
        ('post_saved', 'Post Saved'),
        ('user_followed', 'User Followed'),
        ('profile_updated', 'Profile Updated'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    data = models.JSONField(default=dict, blank=True)  # Additional activity data
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['activity_type', 'timestamp']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} at {self.timestamp}"
