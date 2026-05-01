import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust /api if your prefix is different
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here later to automatically 
// attach your JWT token from localStorage.
export default api;