# Build Android APK for Task Scheduler

## Prerequisites
1. Install Node.js (v16 or higher)
2. Install Android Studio
3. Set up Android SDK and environment variables

## Steps to Build APK

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Initialize Capacitor
```bash
npm run cap:init
# When prompted:
# - App name: Task Scheduler
# - App ID: com.taskscheduler.app
```

### 3. Add Android Platform
```bash
npm run cap:add:android
```

### 4. Build and Sync
```bash
npm run cap:build
```

### 5. Open in Android Studio
```bash
npm run cap:open:android
```

### 6. Generate APK in Android Studio
1. In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. APK will be generated in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Alternative: Command Line Build (if Android SDK is properly configured)
```bash
cd android
./gradlew assembleDebug
```

## Notes
- The app will connect to your backend API at `http://localhost:8000`
- For production, update the API URL in `src/TaskScheduler.jsx`
- You may need to configure network security for HTTP connections in Android
