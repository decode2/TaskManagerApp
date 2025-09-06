// Configuration for API endpoints
// Uses environment variables for flexible configuration

// Get API URL from environment variable or fallback to automatic detection
const getApiBaseUrl = () => {
  // Check if environment variable is set (for production builds)
  const envApiUrl = process.env.REACT_APP_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  // Automatic detection for development
  const isLocalNetwork = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1';

  // If we're served from the backend (same port as backend), use relative URL
  if (window.location.port === '7043' || window.location.port === '7044') {
    return "/api";
  }
  
  if (isLocalNetwork) {
    // For local network access, use HTTP to avoid SSL certificate issues
    // Use the same hostname as the frontend but with the backend port
    return `http://${window.location.hostname}:7043/api`;
  }

  // For local development - use HTTP port 7043
  return "http://localhost:7043/api";
};

export const API_BASE_URL = getApiBaseUrl();

// Environment configuration
export const APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'development';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';

// Log the configuration for debugging
console.log('Environment:', APP_ENVIRONMENT);
console.log('Version:', APP_VERSION);
console.log('Current hostname:', window.location.hostname);
console.log('Current port:', window.location.port);
console.log('API Base URL:', API_BASE_URL);
