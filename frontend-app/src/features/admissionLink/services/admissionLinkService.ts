import axiosInstance from '../../../lib/axios';
import { AdmissionLinkBE, AdmissionLinkFE, MajorFE, AdmissionMethodFE, SubjectGroupFE } from '../types';

interface GetAdmissionLinksResponse {
  success: boolean;
  count?: number;
  data?: AdmissionLinkBE[];
  message?: string;
}

const admissionLinkService = {
  getLinks: async (params: { majorId?: string; admissionMethodId?: string; universityId?: string; year?: number }): Promise<{ success: boolean; data?: AdmissionLinkFE[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAdmissionLinksResponse>('/admission-links', { params });
      if (response.data.success && response.data.data) {
        const linksFE: AdmissionLinkFE[] = response.data.data.map(link => {
          // Đảm bảo các trường lồng nhau được map đúng cách
          const majorData = typeof link.major === 'string' ? { id: link.major, name: 'N/A', code: 'N/A', universityId: 'N/A' } : { id: link.major._id, name: link.major.name, code: link.major.code, universityId: typeof link.major.university === 'string' ? link.major.university : link.major.university._id };
          const methodData = typeof link.admissionMethod === 'string' ? { id: link.admissionMethod, name: 'N/A' } : { id: link.admissionMethod._id, name: link.admissionMethod.name, code: link.admissionMethod.code };
          const groupData = typeof link.subjectGroup === 'string' ? { id: link.subjectGroup, name: 'N/A', code: 'N/A', subjects: [] } : { id: link.subjectGroup._id, name: link.subjectGroup.name, code: link.subjectGroup.code, subjects: link.subjectGroup.subjects };
          
          return {
            id: link._id,
            major: majorData as MajorFE,
            admissionMethod: methodData as AdmissionMethodFE,
            subjectGroup: groupData as SubjectGroupFE,
            year: link.year,
            minScoreRequired: link.minScoreRequired,
            isActive: link.isActive,
          };
        });
        return { success: true, data: linksFE };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách liên kết tuyển sinh." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách liên kết tuyển sinh." };
    }
  },
};
export default admissionLinkService;