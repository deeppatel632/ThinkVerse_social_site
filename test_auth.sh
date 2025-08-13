#!/bin/bash

# Test script for authentication endpoints

BASE_URL="http://localhost:8000"

echo "Testing Thinkverse Authentication System"
echo "========================================"

# Test 1: Get CSRF Token
echo "1. Getting CSRF token..."
CSRF_RESPONSE=$(curl -s -c cookies.txt "${BASE_URL}/api/users/csrf/")
echo "CSRF Response: $CSRF_RESPONSE"

# Extract CSRF token
CSRF_TOKEN=$(echo $CSRF_RESPONSE | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF Token: $CSRF_TOKEN"

# Test 2: Register a new user
echo ""
echo "2. Testing registration..."
REGISTER_RESPONSE=$(curl -s -b cookies.txt -c cookies.txt \
  -X POST "${BASE_URL}/api/users/auth/register/" \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF_TOKEN" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "testpassword123",
    "full_name": "Test User"
  }')

echo "Registration Response: $REGISTER_RESPONSE"

# Extract username from registration response
USERNAME=$(echo $REGISTER_RESPONSE | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
echo "Registered Username: $USERNAME"

# Test 3: Login with the created user
echo ""
echo "3. Testing login..."
LOGIN_RESPONSE=$(curl -s -b cookies.txt -c cookies.txt \
  -X POST "${BASE_URL}/api/users/auth/login/" \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF_TOKEN" \
  -d '{
    "username": "'$USERNAME'",
    "password": "testpassword123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Test 4: Check authentication status
echo ""
echo "4. Checking authentication status..."
AUTH_CHECK_RESPONSE=$(curl -s -b cookies.txt \
  "${BASE_URL}/api/users/auth/check/")

echo "Auth Check Response: $AUTH_CHECK_RESPONSE"

# Test 5: Logout
echo ""
echo "5. Testing logout..."
LOGOUT_RESPONSE=$(curl -s -b cookies.txt \
  -X POST "${BASE_URL}/api/users/auth/logout/" \
  -H "X-CSRFToken: $CSRF_TOKEN")

echo "Logout Response: $LOGOUT_RESPONSE"

# Test 6: Check authentication status after logout
echo ""
echo "6. Checking authentication status after logout..."
AUTH_CHECK_AFTER_LOGOUT=$(curl -s -b cookies.txt \
  "${BASE_URL}/api/users/auth/check/")

echo "Auth Check After Logout: $AUTH_CHECK_AFTER_LOGOUT"

# Cleanup
rm -f cookies.txt

echo ""
echo "Testing completed!"
echo "=================="
