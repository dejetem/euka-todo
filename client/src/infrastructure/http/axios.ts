import axios from 'axios';
import { getToken } from '@/utils/token';


// Helper function to get CSRF token from cookies
const getCSRFToken = (): string => {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }
  return '';
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Add auth token if exists
  const token = getToken();
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }

  // Add CSRF token to request body
  const csrfToken = getCSRFToken();
  if (csrfToken && config.data) {
    // If the request already has data, add _csrf to it
    if (typeof config.data === 'object') {
      config.data = {
        ...config.data,
        _csrf: csrfToken
      };
    }
    // If the request data is a string (e.g., stringified JSON), parse and add _csrf
    else if (typeof config.data === 'string') {
      try {
        const parsedData = JSON.parse(config.data);
        config.data = JSON.stringify({
          ...parsedData,
          _csrf: csrfToken
        });
      } catch (e) {
        console.error('Failed to parse request data:', e);
      }
    }
  }
  // If no data exists but method requires a body, create new data object with just _csrf
  else if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
    config.data = { _csrf: csrfToken };
  }

  return config;
});


export default axiosInstance;