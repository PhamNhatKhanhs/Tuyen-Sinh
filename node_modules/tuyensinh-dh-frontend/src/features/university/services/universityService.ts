// Đảm bảo hàm getAll trả về đúng cấu trúc
import axiosInstance from '../../../lib/axios';
import { UniversityBE, UniversityFE } from '../types';

interface GetAllUniversitiesResponse {
  success: boolean;
  count?: number;
  total?: number;
  pagination?: any;
  data?: UniversityBE[];
  message?: string;
}

const universityService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number; sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<{ success: boolean; data?: UniversityFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllUniversitiesResponse>('/universities', { params });
      if (response.data.success && response.data.data) {
        const universitiesFE: UniversityFE[] = response.data.data.map(uni => ({
          ...uni,
          id: uni._id, 
        }));
        return { success: true, data: universitiesFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách trường." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách trường." };
    }
  },
};
export default universityService;