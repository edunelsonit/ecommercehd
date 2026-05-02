import axios from 'axios';

const api = axios.create({
  baseURL: '', // Works with your Vite proxy
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Kick user to home if token expires
    }
    return Promise.reject(error);
  }
);

export default api;