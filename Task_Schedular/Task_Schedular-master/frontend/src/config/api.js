// API Configuration
// This handles different environments for API calls

const getApiBaseUrl = () => {
  // Check if we're running in a mobile app (Capacitor)
  if (window.Capacitor) {
    // For Android emulator, use 10.0.2.2 to access host machine's localhost
    // For physical device, you'll need to use your computer's IP address
    return 'http://10.0.2.2:8000';
  }
  
  // For web development
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// Alternative: You can also use your computer's IP address for physical devices
// Replace 'YOUR_COMPUTER_IP' with your actual IP address
// export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';

export const API_ENDPOINTS = {
  TASKS: '/tasks',
  HEALTH: '/health'
};
