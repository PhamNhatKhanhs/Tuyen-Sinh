import axiosInstance from '../../../lib/axios';
import { SubjectGroupBE, SubjectGroupFE } from '../../subjectGroup/types';

interface AdminSubjectGroupResponse {
  success: boolean;
  data?: SubjectGroupBE | SubjectGroupFE;
  message?: string;
}

interface AdminGetAllSubjectGroupsResponse {
  success: boolean;
  count?: number;
  total?: number; 
  data?: SubjectGroupBE[];
  message?: string;
}

const subjectGroupAdminService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number; sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<{ success: boolean; data?: SubjectGroupFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<AdminGetAllSubjectGroupsResponse>('/admin/subject-groups', { params });
      if (response.data.success && response.data.data) {
        const groupsFE: SubjectGroupFE[] = response.data.data.map(group => ({
          ...group,
          id: group._id, 
        }));
        return { success: true, data: groupsFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách tổ hợp môn (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách tổ hợp môn (Admin)." };
    }
  },

  getById: async (id: string): Promise<AdminSubjectGroupResponse> => {
    try {
      const response = await axiosInstance.get<AdminSubjectGroupResponse>(`/admin/subject-groups/${id}`);
       if (response.data.success && response.data.data) {
        const groupBE = response.data.data as SubjectGroupBE;
        return { ...response.data, data: { ...groupBE, id: groupBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  create: async (groupData: Omit<SubjectGroupFE, 'id'>): Promise<AdminSubjectGroupResponse> => {
    try {
      const response = await axiosInstance.post<AdminSubjectGroupResponse>('/admin/subject-groups', groupData);
      if (response.data.success && response.data.data) {
        const groupBE = response.data.data as SubjectGroupBE;
        return { ...response.data, data: { ...groupBE, id: groupBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  update: async (id: string, groupData: Partial<Omit<SubjectGroupFE, 'id'>>): Promise<AdminSubjectGroupResponse> => {
    try {
      const response = await axiosInstance.put<AdminSubjectGroupResponse>(`/admin/subject-groups/${id}`, groupData);
      if (response.data.success && response.data.data) {
        const groupBE = response.data.data as SubjectGroupBE;
        return { ...response.data, data: { ...groupBE, id: groupBE._id } };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/admin/subject-groups/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default subjectGroupAdminService;