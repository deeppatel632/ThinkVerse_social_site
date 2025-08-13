from django.db import models
from django.conf import settings
import json

class Blog(models.Model):
    title = models.CharField(max_length=200, blank=True)  # Make title optional for tweets
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blogs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_blogs', blank=True)
    tags = models.TextField(blank=True)  # Store as JSON string
    image_url = models.URLField(blank=True, null=True)
    media_type = models.CharField(max_length=20, choices=[
        ('none', 'None'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('gif', 'GIF')
    ], default='none')
    is_reply = models.BooleanField(default=False)
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        if self.title:
            return self.title
        return f"Post by {self.author.username} - {self.content[:50]}..."
    
    @property
    def likes_count(self):
        return self.likes.count()
    
    @property
    def comments_count(self):
        # For now, comments and replies are the same thing
        return self.replies.count()
    
    @property
    def replies_count(self):
        return self.replies.count()
    
    @property
    def total_engagement(self):
        return self.likes_count + self.replies_count
    
    @property
    def tags_list(self):
        if self.tags:
            try:
                return json.loads(self.tags)
            except json.JSONDecodeError:
                return []
        return []
    
    def get_image_url(self):
        """
        Get image URL with fallback to Picsum placeholder
        """
        if self.image_url and self.image_url.strip():
            return self.image_url
        # Generate consistent placeholder based on post ID
        return f"https://picsum.photos/seed/{self.id}/600/300"
    
    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list) if tags_list else ''
    
    def is_liked_by(self, user):
        if user.is_authenticated:
            return self.likes.filter(id=user.id).exists()
        return False
    
    def is_saved_by(self, user):
        if user.is_authenticated:
            return SavedPost.objects.filter(user=user, post=self).exists()
        return False


class SavedPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-saved_at']
    
    def __str__(self):
        return f"{self.user.username} saved {self.post}"
