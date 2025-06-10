import axiosInstance from '../../../lib/axios';
import { UniversityBE, UniversityFE } from '../../university/types'; // Sử dụng lại type đã có

interface AdminUniversityResponse {
  success: boolean;
  data?: UniversityBE | UniversityFE; // BE trả về _id, FE có thể dùng id
  message?: string;
}

interface AdminGetAllUniversitiesResponse {
  success: boolean;
  count?: number;
  total?: number;
  pagination?: any;
  data?: UniversityBE[];
  message?: string;
}

const universityAdminService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number; sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<{ success: boolean; data?: UniversityFE[]; total?: number; message?: string }> => {
    try {
      // API của Admin để lấy danh sách trường có thể khác public API (ví dụ: lấy cả trường inactive)
      // Giả sử API admin là /admin/universities (đã được protect và authorize ở BE)
      const response = await axiosInstance.get<AdminGetAllUniversitiesResponse>('/admin/universities', { params });
      if (response.data.success && response.data.data) {
        const universitiesFE: UniversityFE[] = response.data.data.map(uni => ({
          ...uni,
          id: uni._id, 
        }));
        return { success: true, data: universitiesFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách trường (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách trường (Admin)." };
    }
  },

  getById: async (id: string): Promise<AdminUniversityResponse> => {
    try {
      const response = await axiosInstance.get<AdminUniversityResponse>(`/admin/universities/${id}`);
       if (response.data.success && response.data.data) {
        const uniBE = response.data.data as UniversityBE;
        return { ...response.data, data: { ...uniBE, id: uniBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  create: async (universityData: Omit<UniversityFE, 'id'>): Promise<AdminUniversityResponse> => {
    try {
      const response = await axiosInstance.post<AdminUniversityResponse>('/admin/universities', universityData);
      if (response.data.success && response.data.data) {
        const uniBE = response.data.data as UniversityBE;
        return { ...response.data, data: { ...uniBE, id: uniBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  update: async (id: string, universityData: Partial<Omit<UniversityFE, 'id'>>): Promise<AdminUniversityResponse> => {
    try {
      const response = await axiosInstance.put<AdminUniversityResponse>(`/admin/universities/${id}`, universityData);
      if (response.data.success && response.data.data) {
        const uniBE = response.data.data as UniversityBE;
        return { ...response.data, data: { ...uniBE, id: uniBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/admin/universities/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default universityAdminService;