import axios from 'axios';
import { store } from '../store'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'; 
console.log("API Base URL:", API_BASE_URL); // Để kiểm tra

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => { // Thêm async để có thể dispatch
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử lại
      console.error('Unauthorized access - 401. Token might be expired or invalid.');
      // Xử lý logout user nếu token hết hạn hoặc không hợp lệ
      // store.dispatch(logout()); // Cần import action logout và cẩn thận vòng lặp vô hạn
      // Hoặc chỉ đơn giản là reject để component tự xử lý (ví dụ: redirect về login)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;