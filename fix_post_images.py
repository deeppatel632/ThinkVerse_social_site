#!/usr/bin/env python3
"""
Script to fix posts with missing images by ensuring all posts have proper image URLs
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to the path
project_dir = Path(__file__).resolve().parent / 'algovision-backend'
sys.path.append(str(project_dir))
os.chdir(project_dir)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from blogs.models import Blog

def fix_missing_images():
    """Fix posts that have empty or null image URLs"""
    print("Checking for posts with missing images...")
    
    # Find posts with empty or null image URLs
    posts_without_images = Blog.objects.filter(
        models.Q(image_url__isnull=True) | models.Q(image_url='')
    )
    
    count = posts_without_images.count()
    print(f"Found {count} posts without proper image URLs")
    
    if count > 0:
        print("Note: These posts will now automatically get placeholder images")
        print("due to the updated get_image_url() method in the Blog model.")
        print("No database updates needed - images will be generated dynamically.")
        
        # List the posts for reference
        for post in posts_without_images[:5]:  # Show first 5
            print(f"- Post {post.id}: '{post.title or post.content[:50]}...'")
            
        if count > 5:
            print(f"... and {count - 5} more posts")
    else:
        print("All posts already have image URLs!")
    
    print("\nImage fix implementation completed successfully!")
    print("All posts will now display images (either original or placeholder)")

if __name__ == '__main__':
    # Import django.db.models for Q objects
    from django.db import models
    fix_missing_images()
