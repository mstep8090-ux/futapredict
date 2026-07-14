import axios from 'axios';

// Load base API URL from env, default to local FastAPI in dev, and relative path in prod
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV ? 'http://localhost:8000' : ''
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically attach JWT token to all requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global handler for session expirations or unauthorized requests
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns a 401 Unauthorized status
    if (error.response && error.response.status === 401) {
      // Clear expired session variables
      localStorage.clear();
      
      // Force redirect to login page (avoiding hook dependencies in root modules)
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
