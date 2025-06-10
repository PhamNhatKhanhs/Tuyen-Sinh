import axiosInstance from '../../../lib/axios';
import type { User } from '../../auth/types';

// User type từ Backend có thể có _id thay vì id
interface UserBE extends Omit<User, 'id'> {
  _id: string;
  createdAt?: string; // Thường BE sẽ có
  updatedAt?: string; // Thường BE sẽ có
}

interface GetAllUsersAdminResponse {
  success: boolean;
  count?: number;
  total?: number;
  pagination?: any;
  data?: UserBE[];
  message?: string;
}

interface UpdateUserStatusAdminResponse {
  success: boolean;
  data?: UserBE; // Backend trả về user đã cập nhật
  message?: string;
}

interface UpdateUserRoleAdminResponse {
  success: boolean;
  data?: UserBE;
  message?: string;
}

interface DeleteUserAdminResponse {
  success: boolean;
  message?: string;
}

const mapUserBEToFE = (userBE: UserBE): User => ({
    id: userBE._id,
    email: userBE.email,
    role: userBE.role,
    fullName: userBE.fullName,
    isActive: userBE.isActive,
    // createdAt: userBE.createdAt, // Thêm nếu cần
});

const userAdminService = {
  getAllUsers: async (params?: { 
    search?: string; 
    role?: 'candidate' | 'admin';
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc'|'desc'; 
  }): Promise<{ success: boolean; data?: User[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllUsersAdminResponse>('/admin/users', { params });
      if (response.data.success && response.data.data) {
        const usersFE: User[] = response.data.data.map(mapUserBEToFE);
        return { success: true, data: usersFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách người dùng." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách người dùng." };
    }
  },
  updateUserStatus: async (userId: string, isActive: boolean): Promise<UpdateUserStatusAdminResponse> => {
    try {
      const response = await axiosInstance.patch<UpdateUserStatusAdminResponse>(`/admin/users/${userId}/status`, { isActive });
      if (response.data.success && response.data.data) {
        return { ...response.data, data: mapUserBEToFE(response.data.data as UserBE) };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  updateUserRole: async (userId: string, role: 'candidate' | 'admin'): Promise<UpdateUserRoleAdminResponse> => {
    try {
      console.log('Sending API request to update role:', { userId, role });
      const response = await axiosInstance.patch<UpdateUserRoleAdminResponse>(`/admin/users/${userId}/role`, { role });
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success && response.data.data) {
        const mappedData = { ...response.data, data: mapUserBEToFE(response.data.data as UserBE) };
        console.log('Mapped response:', mappedData);
        return mappedData;
      }
      console.log('API returned unsuccessful response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API error in updateUserRole:', error);
      console.error('Error response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteUser: async (userId: string): Promise<DeleteUserAdminResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteUserAdminResponse>(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  // Có thể thêm các hàm khác như getUserById, createUser (nếu admin được phép)
};
export default userAdminService;