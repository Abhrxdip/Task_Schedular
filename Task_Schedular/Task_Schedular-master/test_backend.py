#!/usr/bin/env python3
"""
Test script to verify the backend API is working correctly
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing Task Scheduler Backend API...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure the server is running on http://localhost:8000")
        print("   Run: cd backend && python api.py")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test get tasks
    try:
        response = requests.get(f"{base_url}/tasks")
        if response.status_code == 200:
            tasks = response.json()
            print(f"✅ Get tasks successful: {len(tasks)} tasks found")
        else:
            print(f"❌ Get tasks failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get tasks error: {e}")
        return False
    
    # Test add task
    try:
        test_task = {
            "id": 1,
            "title": "Test Task",
            "description": "This is a test task",
            "deadline": "2024-12-31T23:59:59",
            "priority": "medium",
            "status": "pending"
        }
        response = requests.post(f"{base_url}/tasks", json=test_task)
        if response.status_code == 200:
            print("✅ Add task successful")
            print(f"   Added task: {response.json()['title']}")
        else:
            print(f"❌ Add task failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Add task error: {e}")
        return False
    
    print("=" * 50)
    print("🎉 All tests passed! Backend is working correctly.")
    print("\nNext steps:")
    print("1. Start the frontend: cd frontend && npm start")
    print("2. For mobile: cd frontend && npm run build && npm run cap:build")
    return True

if __name__ == "__main__":
    test_backend()
