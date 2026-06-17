import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://foodshare-backend-ao8p.onrender.com'
);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const foodAPI = {
  getAll: () => api.get('/food'),
  getById: (id) => api.get(`/food/${id}`),
  create: (data) => api.post('/food', data),
  update: (id, data) => api.put(`/food/${id}`, data),
  delete: (id) => api.delete(`/food/${id}`),
  search: (query) => api.get(`/food/search?q=${query}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getFood: () => api.get('/admin/food'),
  deleteFood: (id) => api.delete(`/admin/food/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export default api;
