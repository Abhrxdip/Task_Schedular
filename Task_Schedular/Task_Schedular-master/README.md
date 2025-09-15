# Task Scheduler App

A React Native mobile app built with Capacitor for managing tasks with a FastAPI backend.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/yourusername/task-scheduler-app)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.5.1-purple?style=flat-square&logo=capacitor)](https://capacitorjs.com/)

## Features

- Add, edit, and delete tasks
- Set task priorities (High, Medium, Low)
- Set deadlines for tasks
- Track task status (Pending, In Progress, Completed)
- Modern, responsive UI with Tailwind CSS

## Prerequisites

1. Node.js (v16 or higher)
2. Python 3.8+
3. Android Studio (for Android development)
4. FastAPI backend running

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python api.py
```

The backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

For development, the app will run on `http://localhost:3000`

### 3. Build for Android

```bash
cd frontend
npm run build
npm run cap:build
npm run cap:open:android
```

## Network Configuration

### For Android Emulator
- The app is configured to connect to `http://10.0.2.2:8000` (Android emulator's localhost)
- This allows the emulator to access your computer's localhost

### For Physical Device
- Replace `10.0.2.2` with your computer's IP address in `src/config/api.js`
- Make sure your computer and device are on the same network
- Ensure the backend is accessible from the device

### Network Security
- The app includes network security configuration to allow HTTP connections
- For production, consider using HTTPS

## Troubleshooting

### Network Error when Adding Tasks

1. **Check Backend Status**: Ensure the FastAPI backend is running on port 8000
2. **Verify Network Configuration**: 
   - For emulator: Use `http://10.0.2.2:8000`
   - For physical device: Use your computer's IP address
3. **Check Network Security**: Ensure the network security config allows HTTP traffic
4. **Firewall**: Make sure your firewall allows connections on port 8000

### Common Issues

1. **CORS Errors**: The backend includes CORS middleware to allow frontend requests
2. **Network Timeout**: Check if the backend is responding at the configured URL
3. **Permission Issues**: Ensure the app has internet permission in AndroidManifest.xml

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `GET /health` - Health check

## Development

The app uses:
- React 18
- Capacitor for mobile development
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## Building APK

1. Follow the setup instructions above
2. Open Android Studio
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK will be generated in `android/app/build/outputs/apk/debug/`

## GitHub Setup

To push this project to GitHub:

### Quick Setup
1. Double-click `push_to_github.bat` to initialize Git
2. Create a new repository on GitHub
3. Follow the instructions in `GITHUB_SETUP.md`

### Manual Setup
```bash
git init
git add .
git commit -m "Initial commit: Task Scheduler app"
git remote add origin https://github.com/yourusername/task-scheduler-app.git
git push -u origin main
```

For detailed instructions, see [GITHUB_SETUP.md](GITHUB_SETUP.md)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
