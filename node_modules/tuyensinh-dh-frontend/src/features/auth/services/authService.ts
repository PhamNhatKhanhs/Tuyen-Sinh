import axiosInstance from '../../../lib/axios';
import { AuthResponse, User } from '../types';

// Kiểu dữ liệu cho request đăng ký
export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  role?: 'candidate' | 'admin';
  phoneNumber?: string;
  dob?: string; // Date of birth in YYYY-MM-DD format
  idNumber?: string; // ID card/passport number
  gender?: 'male' | 'female' | 'other';
  address?: string;
}

const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email });
      const response = await axiosInstance.post<AuthResponse>('/auth/login', {
        email,
        password
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async register(userData: Partial<User> & { password: string }): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { email: userData.email });
      const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async getMe(): Promise<AuthResponse> {
    try {
      console.log('Fetching current user data');
      const response = await axiosInstance.get<AuthResponse>('/auth/me');
      console.log('Get me response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get me error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin người dùng. Vui lòng thử lại.',
        error: error.response?.data?.error || error.message
      };
    }
  }
};

export default authService;

