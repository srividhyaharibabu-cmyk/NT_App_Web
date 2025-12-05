import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

// Food API
export const foodAPI = {
    logFood: (data) => api.post('/food', data),
    getHistory: (params) => api.get('/food', { params }),
    getWeeklyStats: () => api.get('/food/weekly-stats'),
};

// Admin API
export const adminAPI = {
    getUsers: (params) => api.get('/admin/users', { params }),
    updateStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
    changeRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};

export default api;
