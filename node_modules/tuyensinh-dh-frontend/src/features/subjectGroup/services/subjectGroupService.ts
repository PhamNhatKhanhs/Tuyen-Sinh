import axiosInstance from '../../../lib/axios';
import { SubjectGroupBE, SubjectGroupFE } from '../types';

interface GetAllSubjectGroupsResponse {
  success: boolean;
  count?: number;
  data?: SubjectGroupBE[];
  message?: string;
}
const subjectGroupService = {
  getAll: async (): Promise<{ success: boolean; data?: SubjectGroupFE[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllSubjectGroupsResponse>('/subject-groups');
      if (response.data.success && response.data.data) {
        const groupsFE: SubjectGroupFE[] = response.data.data.map(group => ({
          ...group,
          id: group._id,
        }));
        return { success: true, data: groupsFE };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách tổ hợp môn." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách tổ hợp môn." };
    }
  },
};
export default subjectGroupService;