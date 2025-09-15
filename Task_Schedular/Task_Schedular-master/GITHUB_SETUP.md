# How to Push Task Scheduler to GitHub

This guide will help you push your Task Scheduler project to GitHub.

## Prerequisites

### 1. Install Git
If Git is not installed on your system:

**For Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your command prompt/PowerShell

**Verify installation:**
```bash
git --version
```

### 2. Create GitHub Account
1. Go to https://github.com
2. Sign up for a free account if you don't have one
3. Verify your email address

## Step-by-Step Instructions

### Step 1: Initialize Git Repository
Open PowerShell/Command Prompt in your project directory and run:

```bash
cd "C:\Users\abhra\OneDrive\Desktop\Task_Schedular\Task_Schedular\Task_Schedular-master"
git init
```

### Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Create Initial Commit
```bash
git commit -m "Initial commit: Task Scheduler app with React frontend and FastAPI backend"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `task-scheduler-app`
   - **Description**: `A React Native mobile app for task management with FastAPI backend`
   - **Visibility**: Public (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 6: Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/task-scheduler-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Alternative: Using GitHub Desktop (Easier for beginners)

### 1. Download GitHub Desktop
- Go to https://desktop.github.com/
- Download and install GitHub Desktop

### 2. Set up Repository
1. Open GitHub Desktop
2. Click "Add an Existing Repository from your Hard Drive"
3. Navigate to your project folder: `C:\Users\abhra\OneDrive\Desktop\Task_Schedular\Task_Schedular\Task_Schedular-master`
4. Click "Add Repository"

### 3. Publish to GitHub
1. In GitHub Desktop, click "Publish repository"
2. Choose repository name: `task-scheduler-app`
3. Add description: `A React Native mobile app for task management with FastAPI backend`
4. Choose visibility (Public/Private)
5. Click "Publish Repository"

## What Gets Uploaded

✅ **Included in GitHub:**
- All source code (React components, Python backend)
- Configuration files (package.json, requirements.txt, etc.)
- Documentation (README.md, setup guides)
- Project structure and dependencies

❌ **Excluded (via .gitignore):**
- node_modules/ (dependencies - can be reinstalled)
- build/ folders (generated files)
- Android build files (can be regenerated)
- Excel data files (tasks_deadlines.xlsx)
- Environment variables and secrets
- IDE configuration files

## After Pushing to GitHub

### 1. Update README
Your repository will have a comprehensive README.md with:
- Project description
- Setup instructions
- Features list
- API documentation

### 2. Add Topics/Tags
On your GitHub repository page:
1. Click the gear icon next to "About"
2. Add topics: `react`, `fastapi`, `mobile-app`, `task-management`, `capacitor`

### 3. Enable GitHub Pages (Optional)
If you want to host a demo:
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose "main" branch and "/ (root)" folder

## Troubleshooting

### Authentication Issues
If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Go to GitHub → Settings → Developer settings → Personal access tokens
3. Generate new token with "repo" permissions
4. Use token as password when prompted

### Large Files
If you get errors about large files:
```bash
git rm --cached frontend/android/app/build/
git commit -m "Remove large build files"
```

### Network Issues
If push fails due to network:
```bash
git config --global http.postBuffer 524288000
git push -u origin main
```

## Next Steps

After successfully pushing to GitHub:

1. **Share your project**: Share the GitHub URL with others
2. **Collaborate**: Invite collaborators if needed
3. **Issues & PRs**: Use GitHub's issue tracker for bugs/features
4. **Releases**: Create releases for stable versions
5. **CI/CD**: Set up GitHub Actions for automated testing

## Repository Structure on GitHub

Your repository will look like this:
```
task-scheduler-app/
├── README.md
├── .gitignore
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── capacitor.config.ts
├── setup_and_run.py
├── test_backend.py
└── GITHUB_SETUP.md
```

## Commands Summary

```bash
# Initialize repository
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Task Scheduler app"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/task-scheduler-app.git

# Push to GitHub
git push -u origin main
```

That's it! Your Task Scheduler project will now be available on GitHub for the world to see! 🎉
