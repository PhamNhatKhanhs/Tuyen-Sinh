import axiosInstance from '../../../lib/axios'; 
import { User } from '../store/authSlice'; 

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

// Kiểu dữ liệu cho response từ API (khớp với Backend)
interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any; // Backend trả về user có _id, cần map ở slice
  error?: string; // Nếu có lỗi từ BE
}


const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
     try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getMe: async (): Promise<{success: boolean, user?: User, message?: string}> => {
    try {
        const response = await axiosInstance.get<{success: boolean, user: any}>('/auth/me');
        if (response.data.success && response.data.user) {
            const backendUser = response.data.user;
            const feUser: User = { // Map _id to id
                id: backendUser._id,
                email: backendUser.email,
                role: backendUser.role,
                fullName: backendUser.fullName,
                isActive: backendUser.isActive,
            };
            return { success: true, user: feUser };
        }
        return { success: false, message: "Không thể lấy thông tin người dùng."};
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw error;
    }
  }
};
export default authService;

