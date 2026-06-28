import axios from 'axios';

const api = axios.create({
  baseURL: 'https://leafora-smart-restaurant.onrender.com',
});

// Request interceptor to automatically add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
