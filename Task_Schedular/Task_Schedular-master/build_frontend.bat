@echo off
echo Building Task Scheduler Frontend...
cd frontend
npm install
npm run build
npx cap sync
echo Build completed! You can now open the project in Android Studio.
pause
