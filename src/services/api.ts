import axios from 'axios';

// Create an axios instance with base URL and default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;