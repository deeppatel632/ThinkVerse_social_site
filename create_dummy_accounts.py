#!/usr/bin/env python3

import os
import django
import sys
from pathlib import Path

# Add the project directory to the Python path
project_dir = Path(__file__).resolve().parent / 'algovision-backend'
sys.path.append(str(project_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User, Follow
from django.contrib.auth.hashers import make_password
from datetime import datetime, timedelta
import random

# Indian names data
indian_names = [
    {
        'username': 'arjun_sharma',
        'email': 'arjun.sharma@example.com',
        'full_name': 'Arjun Sharma',
        'bio': 'Software Engineer from Mumbai. Love coding and cricket! 🏏',
        'location': 'Mumbai, Maharashtra',
        'website': 'https://arjunsharma.dev'
    },
    {
        'username': 'priya_patel',
        'email': 'priya.patel@example.com',
        'full_name': 'Priya Patel',
        'bio': 'UI/UX Designer passionate about creating beautiful experiences ✨',
        'location': 'Bangalore, Karnataka',
        'website': 'https://priyapatel.design'
    },
    {
        'username': 'rohit_gupta',
        'email': 'rohit.gupta@example.com',
        'full_name': 'Rohit Gupta',
        'bio': 'Data Scientist | ML Enthusiast | Foodie 🍛',
        'location': 'Delhi, India',
        'website': ''
    },
    {
        'username': 'sneha_reddy',
        'email': 'sneha.reddy@example.com',
        'full_name': 'Sneha Reddy',
        'bio': 'Product Manager at tech startup. Coffee addict ☕',
        'location': 'Hyderabad, Telangana',
        'website': 'https://sneha-reddy.com'
    },
    {
        'username': 'vikram_singh',
        'email': 'vikram.singh@example.com',
        'full_name': 'Vikram Singh',
        'bio': 'Full Stack Developer | Open Source Contributor | Traveler 🌍',
        'location': 'Pune, Maharashtra',
        'website': 'https://github.com/vikramsingh'
    },
    {
        'username': 'kavya_nair',
        'email': 'kavya.nair@example.com',
        'full_name': 'Kavya Nair',
        'bio': 'Digital Marketing Expert | Photography lover 📸',
        'location': 'Kochi, Kerala',
        'website': 'https://kavyanair.com'
    },
    {
        'username': 'aman_verma',
        'email': 'aman.verma@example.com',
        'full_name': 'Aman Verma',
        'bio': 'Startup Founder | Tech Enthusiast | Fitness freak 💪',
        'location': 'Gurgaon, Haryana',
        'website': 'https://amanverma.in'
    },
    {
        'username': 'riya_agarwal',
        'email': 'riya.agarwal@example.com',
        'full_name': 'Riya Agarwal',
        'bio': 'Content Creator | Blogger | Book lover 📚',
        'location': 'Jaipur, Rajasthan',
        'website': 'https://riyaagarwal.blog'
    },
    {
        'username': 'karthik_rao',
        'email': 'karthik.rao@example.com',
        'full_name': 'Karthik Rao',
        'bio': 'DevOps Engineer | Cloud Architecture | Gaming 🎮',
        'location': 'Chennai, Tamil Nadu',
        'website': ''
    },
    {
        'username': 'ananya_singh',
        'email': 'ananya.singh@example.com',
        'full_name': 'Ananya Singh',
        'bio': 'Frontend Developer | React Enthusiast | Dance lover 💃',
        'location': 'Lucknow, Uttar Pradesh',
        'website': 'https://ananyasingh.dev'
    },
    {
        'username': 'rajesh_kumar',
        'email': 'rajesh.kumar@example.com',
        'full_name': 'Rajesh Kumar',
        'bio': 'Backend Developer | Python Expert | Cricket fan 🏏',
        'location': 'Kolkata, West Bengal',
        'website': ''
    },
    {
        'username': 'meera_joshi',
        'email': 'meera.joshi@example.com',
        'full_name': 'Meera Joshi',
        'bio': 'Graphic Designer | Artist | Nature enthusiast 🌿',
        'location': 'Ahmedabad, Gujarat',
        'website': 'https://meerajoshi.art'
    }
]

def create_dummy_accounts():
    print("Creating dummy accounts with Indian names...")
    created_users = []
    
    for user_data in indian_names:
        # Check if user already exists
        if User.objects.filter(username=user_data['username']).exists():
            print(f"User {user_data['username']} already exists, skipping...")
            user = User.objects.get(username=user_data['username'])
            created_users.append(user)
            continue
        
        # Create user
        user = User.objects.create(
            username=user_data['username'],
            email=user_data['email'],
            password=make_password('password123'),  # Simple password for testing
            full_name=user_data['full_name'],
            bio=user_data['bio'],
            location=user_data['location'],
            website=user_data['website'],
            is_verified=random.choice([True, False]),  # Random verification status
            date_joined=datetime.now() - timedelta(days=random.randint(1, 365))
        )
        
        created_users.append(user)
        print(f"Created user: {user.username} ({user.full_name})")
    
    return created_users

def create_follow_relationships(users):
    print("\nCreating follow relationships...")
    
    # Create some random follow relationships
    for user in users:
        # Each user follows 2-5 random other users
        follow_count = random.randint(2, 5)
        potential_follows = [u for u in users if u != user]
        follows = random.sample(potential_follows, min(follow_count, len(potential_follows)))
        
        for follow_user in follows:
            # Check if relationship already exists
            if not Follow.objects.filter(follower=user, followed=follow_user).exists():
                Follow.objects.create(follower=user, followed=follow_user)
                print(f"{user.username} now follows {follow_user.username}")

def print_account_details(users):
    print("\n" + "="*60)
    print("DUMMY ACCOUNTS CREATED - LOGIN DETAILS")
    print("="*60)
    print("All accounts have password: password123")
    print("-"*60)
    
    for user in users:
        print(f"Username: {user.username}")
        print(f"Full Name: {user.full_name}")
        print(f"Email: {user.email}")
        print(f"Location: {user.location}")
        print(f"Verified: {'✓' if user.is_verified else '✗'}")
        print(f"Followers: {user.get_followers_count()}")
        print(f"Following: {user.get_following_count()}")
        print("-"*60)

if __name__ == "__main__":
    try:
        # Create dummy accounts
        users = create_dummy_accounts()
        
        # Create follow relationships
        create_follow_relationships(users)
        
        # Print account details
        print_account_details(users)
        
        print(f"\n✅ Successfully created {len(users)} dummy accounts!")
        print("You can now test the platform with these accounts.")
        print("Login with any username above and password: password123")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
