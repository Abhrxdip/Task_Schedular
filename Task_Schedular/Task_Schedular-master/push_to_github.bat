@echo off
echo ========================================
echo    Task Scheduler - Push to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding all files to Git...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: Task Scheduler app with React frontend and FastAPI backend"

echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo.
echo 1. Go to https://github.com and create a new repository
echo 2. Copy the repository URL (e.g., https://github.com/username/task-scheduler-app.git)
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo Or use GitHub Desktop for easier setup!
echo.
echo ========================================
pause
