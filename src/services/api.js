import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Add CORS configuration
  withCredentials: false,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    // Network connection errors
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' || 
        error.code === 'ENOTFOUND' ||
        error.message.includes('Network Error') ||
        error.message.includes('CORS') ||
        !error.response) {
      
      console.error('Network connection failed. Backend may not be running on:', API_BASE_URL);
      
      // More specific CORS error message
      if (error.message.includes('CORS') || error.code === 'ERR_NETWORK') {
        throw new Error(`CORS Error: Cannot connect to backend at ${API_BASE_URL}. The backend server needs to allow cross-origin requests from your domain.`);
      }
      
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running and accessible.`);
    }
    
    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server is taking too long to respond.');
    }
    
    // Authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }
    
    // Server errors with custom messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Generic server errors
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Movie API calls
export const movieAPI = {
  getAllMovies: (params = {}) => api.get('/movies', { params }),
  getMovie: (id) => api.get(`/movies/${id}`),
  addMovie: (movieData) => api.post('/movies', movieData),
  updateMovie: (id, movieData) => api.put(`/movies/${id}`, movieData),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
  getNewlyAdded: (limit = 10) => api.get('/movies/newly-added', { params: { limit } }),
  searchMovies: (query, params = {}) => api.get('/movies/search', { params: { q: query, ...params } }),
  getStats: () => api.get('/movies/admin/stats'),
};

// Admin API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Ads API calls
export const adsAPI = {
  getAll: () => api.get('/ads'),
  getAdsByPosition: (position) => api.get(`/ads/position/${position}`),
  createAd: (adData) => api.post('/ads', adData),
  updateAd: (id, adData) => api.put(`/ads/${id}`, adData),
  deleteAd: (id) => api.delete(`/ads/${id}`),
  trackClick: (id) => api.post(`/ads/${id}/click`),
  trackImpression: (id) => api.post(`/ads/${id}/impression`),
};

// Popup API calls
export const popupAPI = {
  getPopupSettings: () => api.get('/popup'),
  updatePopupSettings: (data) => api.put('/popup', data),
};

// Site settings API calls
export const siteAPI = {
  getSettings: () => api.get('/site-settings'),
  updateSettings: (data) => api.put('/site-settings', data),
};

// Health check API call
export const healthAPI = {
  check: () => axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 }),
};

export default api;