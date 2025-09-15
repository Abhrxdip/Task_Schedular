#!/usr/bin/env python3
"""
Setup and run script for Task Scheduler App
This script helps you get the app running quickly
"""

import subprocess
import sys
import os
import time
import requests
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=shell, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_backend_running():
    """Check if the backend is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("🚀 Task Scheduler App Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print("❌ Please run this script from the Task_Schedular-master directory")
        return
    
    # Step 1: Install backend dependencies
    print("\n📦 Installing backend dependencies...")
    success, stdout, stderr = run_command("pip install -r requirements.txt", cwd="backend")
    if success:
        print("✅ Backend dependencies installed")
    else:
        print(f"❌ Failed to install backend dependencies: {stderr}")
        return
    
    # Step 2: Install frontend dependencies
    print("\n📦 Installing frontend dependencies...")
    success, stdout, stderr = run_command("npm install", cwd="frontend")
    if success:
        print("✅ Frontend dependencies installed")
    else:
        print(f"❌ Failed to install frontend dependencies: {stderr}")
        return
    
    # Step 3: Start backend
    print("\n🔧 Starting backend server...")
    if check_backend_running():
        print("✅ Backend is already running")
    else:
        print("Starting backend server in background...")
        # Start backend in background
        backend_process = subprocess.Popen(
            [sys.executable, "api.py"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for the server to start
        time.sleep(3)
        
        if check_backend_running():
            print("✅ Backend server started successfully")
        else:
            print("❌ Failed to start backend server")
            return
    
    # Step 4: Build frontend
    print("\n🔨 Building frontend...")
    success, stdout, stderr = run_command("npm run build", cwd="frontend")
    if success:
        print("✅ Frontend built successfully")
    else:
        print(f"❌ Failed to build frontend: {stderr}")
        return
    
    # Step 5: Sync with Capacitor
    print("\n📱 Syncing with Capacitor...")
    success, stdout, stderr = run_command("npx cap sync", cwd="frontend")
    if success:
        print("✅ Capacitor sync completed")
    else:
        print(f"❌ Failed to sync with Capacitor: {stderr}")
        return
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\nYour app is ready to use:")
    print("1. Backend is running at: http://localhost:8000")
    print("2. Frontend is built and ready for mobile")
    print("\nTo test the app:")
    print("1. Open Android Studio")
    print("2. Open the project: frontend/android")
    print("3. Run the app on an emulator or device")
    print("\nTo run in development mode:")
    print("cd frontend && npm start")
    
    print("\n📋 Network Configuration:")
    print("- For Android emulator: http://10.0.2.2:8000")
    print("- For physical device: Replace with your computer's IP address")
    print("- Update src/config/api.js if needed")

if __name__ == "__main__":
    main()
