import axios from 'axios';
import { store } from '../store';
import { logout } from '../features/auth/store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu là lỗi token hết hạn
      if (error.response?.data?.message?.includes('Token đã hết hạn')) {
        // Xóa token và user
        localStorage.removeItem('token'); // Changed from 'authToken' to 'token'
        localStorage.removeItem('authUser');
        
        // Dispatch action logout
        store.dispatch(logout());
        
        // Chuyển hướng về trang login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;