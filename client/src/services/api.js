import axios from 'axios';

// Create Axios service instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach request interceptor for JWT Bearer header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined' && !token.startsWith('demo_token_')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global auth error handling & 3-hour session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response && error.response.status === 401;
    const isTokenExpired = error.response?.data?.code === 'TOKEN_EXPIRED';

    if (isUnauthorized || isTokenExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('demoUser');

      // Dispatch custom session expiration event
      window.dispatchEvent(new CustomEvent('auth:session-expired'));

      // Redirect to login with sessionExpired query flag if not already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?sessionExpired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  exportCSV: () => api.get('/admin/export-csv', { responseType: 'blob' })
};

export default api;
