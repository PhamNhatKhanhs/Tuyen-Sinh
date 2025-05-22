import axiosInstance from '../../../lib/axios';
import { AdmissionLinkBE, AdmissionLinkFE } from '../../admissionLink/types';
import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';


interface AdminAdmissionLinkResponse {
  success: boolean;
  data?: AdmissionLinkBE | AdmissionLinkFE; // BE trả về _id, FE có thể dùng id
  message?: string;
}

interface AdminGetAllAdmissionLinksResponse {
  success: boolean;
  count?: number;
  total?: number; 
  data?: AdmissionLinkBE[];
  message?: string;
}

// Dữ liệu để tạo hoặc cập nhật một link
export interface AdmissionLinkFormData {
  major: string; // majorId
  admissionMethod: string; // admissionMethodId
  subjectGroup: string; // subjectGroupId
  year: number;
  minScoreRequired?: number;
  isActive?: boolean;
}


const mapAdmissionLinkBEToFE = (linkBE: AdmissionLinkBE): AdmissionLinkFE => {
  const major = typeof linkBE.major === 'object' ? linkBE.major : null;
  const admissionMethod = typeof linkBE.admissionMethod === 'object' ? linkBE.admissionMethod : null;
  const subjectGroup = typeof linkBE.subjectGroup === 'object' ? linkBE.subjectGroup : null;
  
  // Lấy thông tin university từ major (nếu đã populate)
  let universityName, universityId;
  if (major && typeof major.universityId === 'string') { // Giả sử MajorFE có universityId
      universityId = major.universityId;
      // Nếu major.university là object (đã populate từ BE)
      if (major.universityName) {
          universityName = major.universityName;
      }
      // Nếu BE trả về university là object trong major
      else if (linkBE.major && typeof linkBE.major === 'object' && linkBE.major.university && typeof linkBE.major.university === 'object') {
          universityName = (linkBE.major.university as any).name; // Cần type an toàn hơn
          universityId = (linkBE.major.university as any)._id || (linkBE.major.university as any).id;
      }
  }


  return {
    id: linkBE._id,
    majorId: major?.id || (typeof linkBE.major === 'string' ? linkBE.major : 'N/A'),
    majorName: major?.name || 'N/A',
    majorCode: major?.code,
    universityId: universityId || 'N/A',
    universityName: universityName || 'N/A',
    admissionMethodId: admissionMethod?.id || (typeof linkBE.admissionMethod === 'string' ? linkBE.admissionMethod : 'N/A'),
    admissionMethodName: admissionMethod?.name || 'N/A',
    subjectGroupId: subjectGroup?.id || (typeof linkBE.subjectGroup === 'string' ? linkBE.subjectGroup : 'N/A'),
    subjectGroupName: subjectGroup?.name || 'N/A',
    subjectGroupCode: subjectGroup?.code,
    year: linkBE.year,
    minScoreRequired: linkBE.minScoreRequired,
    isActive: linkBE.isActive,
  };
};


const admissionLinkAdminService = {
  getAll: async (params?: { 
    universityId?: string; 
    majorId?: string; 
    admissionMethodId?: string; 
    subjectGroupId?: string; 
    year?: number; 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc'|'desc';
  }): Promise<{ success: boolean; data?: AdmissionLinkFE[]; total?: number; message?: string }> => {
    try {
      // API của Admin để lấy danh sách link có thể khác public API
      const response = await axiosInstance.get<AdminGetAllAdmissionLinksResponse>('/admin/major-admission-subject-groups', { params });
      if (response.data.success && response.data.data) {
        const linksFE: AdmissionLinkFE[] = response.data.data.map(mapAdmissionLinkBEToFE);
        return { success: true, data: linksFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách liên kết (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách liên kết (Admin)." };
    }
  },

  create: async (linkData: AdmissionLinkFormData): Promise<AdminAdmissionLinkResponse> => {
    try {
      const response = await axiosInstance.post<AdminAdmissionLinkResponse>('/admin/major-admission-subject-groups', linkData);
      if (response.data.success && response.data.data) {
        return { ...response.data, data: mapAdmissionLinkBEToFE(response.data.data as AdmissionLinkBE) };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  update: async (id: string, linkData: Partial<AdmissionLinkFormData>): Promise<AdminAdmissionLinkResponse> => {
    try {
      // Backend có thể không cho phép update major, admissionMethod, subjectGroup, year của link. Chỉ isActive, minScore.
      const response = await axiosInstance.put<AdminAdmissionLinkResponse>(`/admin/major-admission-subject-groups/${id}`, linkData);
      if (response.data.success && response.data.data) {
         return { ...response.data, data: mapAdmissionLinkBEToFE(response.data.data as AdmissionLinkBE) };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/admin/major-admission-subject-groups/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default admissionLinkAdminService;