import axiosInstance from '../../../lib/axios';
import type { ApplicationDetailBE, ApplicationAdminListItemFE } from '../../application/types';

interface GetAllApplicationsAdminResponse {
  success: boolean;
  count?: number;
  total?: number;
  pagination?: any;
  data?: ApplicationDetailBE[]; 
  message?: string;
}
interface GetApplicationByIdAdminResponse {
  success: boolean;
  data?: ApplicationDetailBE;
  message?: string;
}
interface UpdateApplicationStatusAdminRequest {
  status: ApplicationDetailBE['status'];
  adminNotes?: string;
}
interface UpdateApplicationStatusAdminResponse {
  success: boolean;
  data?: ApplicationDetailBE;
  message?: string;
}

const applicationAdminService = {
  getAll: async (params?: { 
    searchCandidate?: string; universityId?: string; majorId?: string; status?: string;
    year?: number; dateFrom?: string; dateTo?: string; page?: number; limit?: number; 
    sortBy?: string; sortOrder?: 'asc'|'desc'; 
  }): Promise<{ success: boolean; data?: ApplicationAdminListItemFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllApplicationsAdminResponse>('/admin/applications', { params });      if (response.data.success && response.data.data) {
        const applicationsFE: ApplicationAdminListItemFE[] = response.data.data
          .filter(app => app && app._id) // Filter out null/undefined items
          .map(app => ({
            id: app._id,
            candidateName: (typeof app.candidate === 'object' && app.candidate) ? (app.candidate.fullName || app.candidate.email || 'N/A') : 'N/A',
            candidateEmail: (typeof app.candidate === 'object' && app.candidate) ? (app.candidate.email || 'N/A') : 'N/A',
            universityName: (typeof app.university === 'object' && app.university) ? (app.university.name || 'N/A') : 'N/A',
            universityCode: (typeof app.university === 'object' && app.university) ? app.university.code : undefined,
            majorName: (typeof app.major === 'object' && app.major) ? (app.major.name || 'N/A') : 'N/A',
            majorCode: (typeof app.major === 'object' && app.major) ? app.major.code : undefined,
            submissionDate: app.submissionDate ? new Date(app.submissionDate).toLocaleDateString('vi-VN') : 'N/A',
            status: app.status || 'pending',
            year: app.year || new Date().getFullYear(),
          }));
        return { success: true, data: applicationsFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách hồ sơ (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách hồ sơ (Admin)." };
    }
  },  getById: async (id: string): Promise<GetApplicationByIdAdminResponse> => {
    try {
      console.log('🌐 ApplicationAdminService.getById - Making API call for ID:', id);
      const response = await axiosInstance.get<GetApplicationByIdAdminResponse>(`/admin/applications/${id}`);
      console.log('📦 ApplicationAdminService.getById - Raw response:', response);
      console.log('📋 ApplicationAdminService.getById - Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('💥 ApplicationAdminService.getById - Error:', error);
      console.error('📄 ApplicationAdminService.getById - Error response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  updateStatus: async (id: string, data: UpdateApplicationStatusAdminRequest): Promise<UpdateApplicationStatusAdminResponse> => {
    try {
      const response = await axiosInstance.put<UpdateApplicationStatusAdminResponse>(`/admin/applications/${id}/status`, data);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default applicationAdminService;