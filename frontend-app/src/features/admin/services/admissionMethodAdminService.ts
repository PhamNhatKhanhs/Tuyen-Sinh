import axiosInstance from '../../../lib/axios';
import { AdmissionMethodBE, AdmissionMethodFE } from '../../admissionMethod/types';

interface AdminAdmissionMethodResponse {
  success: boolean;
  data?: AdmissionMethodBE | AdmissionMethodFE;
  message?: string;
}

interface AdminGetAllAdmissionMethodsResponse {
  success: boolean;
  count?: number;
  total?: number; // Nếu có phân trang từ BE
  data?: AdmissionMethodBE[];
  message?: string;
}

const admissionMethodAdminService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number; sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<{ success: boolean; data?: AdmissionMethodFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<AdminGetAllAdmissionMethodsResponse>('/admin/admission-methods', { params });
      if (response.data.success && response.data.data) {
        const methodsFE: AdmissionMethodFE[] = response.data.data.map(method => ({
          ...method,
          id: method._id, 
        }));
        return { success: true, data: methodsFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách phương thức xét tuyển (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách phương thức xét tuyển (Admin)." };
    }
  },

  getById: async (id: string): Promise<AdminAdmissionMethodResponse> => {
    try {
      const response = await axiosInstance.get<AdminAdmissionMethodResponse>(`/admin/admission-methods/${id}`);
       if (response.data.success && response.data.data) {
        const methodBE = response.data.data as AdmissionMethodBE;
        return { ...response.data, data: { ...methodBE, id: methodBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  create: async (methodData: Omit<AdmissionMethodFE, 'id'>): Promise<AdminAdmissionMethodResponse> => {
    try {
      console.log('🔍 [AdmissionMethod Service] Creating with data:', methodData);
      
      // Clean the data before sending
      const cleanData = {
        name: methodData.name?.trim(),
        code: methodData.code?.trim() || undefined,
        description: methodData.description?.trim() || undefined,
        isActive: methodData.isActive !== undefined ? methodData.isActive : true
      };
      
      // Remove undefined values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined || cleanData[key] === '') {
          delete cleanData[key];
        }
      });
      
      console.log('🧹 [AdmissionMethod Service] Cleaned data:', cleanData);
      
      const response = await axiosInstance.post<AdminAdmissionMethodResponse>('/admin/admission-methods', cleanData);
      
      console.log('✅ [AdmissionMethod Service] Response:', response.data);
      
      if (response.data.success && response.data.data) {
        const methodBE = response.data.data as AdmissionMethodBE;
        return { ...response.data, data: { ...methodBE, id: methodBE._id } };
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ [AdmissionMethod Service] Create error:', error);
      console.error('❌ [AdmissionMethod Service] Error response:', error.response?.data);
      console.error('❌ [AdmissionMethod Service] Error status:', error.response?.status);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi tạo phương thức xét tuyển'
      };
    }
  },

  update: async (id: string, methodData: Partial<Omit<AdmissionMethodFE, 'id'>>): Promise<AdminAdmissionMethodResponse> => {
    try {
      const response = await axiosInstance.put<AdminAdmissionMethodResponse>(`/admin/admission-methods/${id}`, methodData);
      if (response.data.success && response.data.data) {
        const methodBE = response.data.data as AdmissionMethodBE;
        return { ...response.data, data: { ...methodBE, id: methodBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/admin/admission-methods/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default admissionMethodAdminService;