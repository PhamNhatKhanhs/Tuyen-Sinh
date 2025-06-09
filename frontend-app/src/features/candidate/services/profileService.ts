import axiosInstance from '../../../lib/axios';

// Types for profile update
export interface ProfileUpdateData {
  fullName?: string;
  phoneNumber?: string;
  dob?: string; // ISO date string
  idNumber?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// API service for user profile operations
const profileService = {
  // Update user profile information
  updateProfile: async (profileData: ProfileUpdateData): Promise<ProfileUpdateResponse> => {
    try {
      const response = await axiosInstance.put<ProfileUpdateResponse>('/candidate/profile', profileData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.',
      };
    }
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await axiosInstance.get('/candidate/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin.',
      };
    }
  },
};

export default profileService;
