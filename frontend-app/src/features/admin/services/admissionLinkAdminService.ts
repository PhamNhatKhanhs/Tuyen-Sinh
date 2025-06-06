// File này dùng cho admin, nhưng logic map có thể dùng chung.
// Đảm bảo admissionLinkService.ts (public) cũng có logic map tương tự.
import axiosInstance from '../../../lib/axios';
import type { AdmissionLinkBE, AdmissionLinkFE } from '../../admissionLink/types';
import type { MajorFE } from '../../major/types';
import type { AdmissionMethodFE } from '../../admissionMethod/types';
import type { SubjectGroupFE } from '../../subjectGroup/types';
import type { UniversityFE } from '../../university/types';
// import { AdmissionLinkBE, AdmissionLinkFE, AdmissionLinkFormData } from '../../admissionLink/types'; // Đã import ở trên
// import { MajorFE } from '../../major/types'; // Đã import ở trên
// import { AdmissionMethodFE } from '../../admissionMethod/types'; // Đã import ở trên
// import { SubjectGroupFE } from '../../subjectGroup/types'; // Đã import ở trên


interface AdminAdmissionLinkResponse { /* ... */ }
interface AdminGetAllAdmissionLinksResponse { /* ... */ }
export interface AdmissionLinkFormData {
  major: string;
  admissionMethod: string;
  subjectGroup: string;
  year: number;
  minScoreRequired?: number;
  isActive?: boolean;
}

// CẬP NHẬT HÀM MAP NÀY CHO CẢ admissionLinkService.ts (public)
const mapAdmissionLinkBEToFE = (linkBE: AdmissionLinkBE): AdmissionLinkFE => {
    const placeholderMajor = { id: 'N/A_MAJOR', name: 'Ngành không xác định', code: 'N/A', universityId: 'N/A' };
    const placeholderMethod = { id: 'N/A_METHOD', name: 'PTXT không xác định' };
    const placeholderGroup = { id: 'N/A_GROUP_OR_NONE', name: 'Không yêu cầu tổ hợp', code: '', subjects: [] };
    let major: any;
    if (typeof linkBE.major === 'object' && linkBE.major !== null) {
        major = { ...linkBE.major, id: (linkBE.major as any).id };
    } else if (typeof linkBE.major === 'string') {
        major = { id: linkBE.major, name: `ID: ${linkBE.major}`, code: 'N/A', universityId: 'N/A' };
    } else {
        major = placeholderMajor;
    }
    if (typeof (linkBE as any).major === 'object' && (linkBE as any).major && typeof (linkBE as any).major.university === 'object' && (linkBE as any).major.university !== null) {
        const uni = (linkBE as any).major.university;
        major.universityId = uni.id;
        major.universityName = uni.name;
    }
    let admissionMethod: any;
    if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null) {
        admissionMethod = { ...linkBE.admissionMethod, id: (linkBE.admissionMethod as any).id };
    } else if (typeof linkBE.admissionMethod === 'string') {
        admissionMethod = { id: linkBE.admissionMethod, name: `ID: ${linkBE.admissionMethod}` };
    } else {
        admissionMethod = placeholderMethod;
    }
    let subjectGroup: any;
    if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null) {
        subjectGroup = { ...linkBE.subjectGroup, id: (linkBE.subjectGroup as any).id, subjects: (linkBE.subjectGroup as any).subjects || [] };
    } else if (typeof linkBE.subjectGroup === 'string') {
        subjectGroup = { id: linkBE.subjectGroup, name: `ID: ${linkBE.subjectGroup}`, code: 'N/A', subjects: [] };
    } else {
        subjectGroup = placeholderGroup;
    }
    return {
        id: linkBE._id,
        majorId: major.id,
        majorName: major.name,
        majorCode: major.code,
        universityId: major.universityId,
        universityName: major.universityName,
        admissionMethodId: admissionMethod.id,
        admissionMethodName: admissionMethod.name,
        subjectGroupId: subjectGroup.id,
        subjectGroupName: subjectGroup.name,
        subjectGroupCode: subjectGroup.code,
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
      const response = await axiosInstance.get('/admin/masg', { params });
      if (response.data.success && response.data.data) {
        const linksFE: AdmissionLinkFE[] = response.data.data.map(mapAdmissionLinkBEToFE);
        return { success: true, data: linksFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách liên kết (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách liên kết (Admin)." };
    }
  },

  create: async (linkData: AdmissionLinkFormData): Promise<any> => {
    try {
      const response = await axiosInstance.post('/admin/masg', linkData);
      if (response.data.success && response.data.data) {
        return { ...response.data, data: mapAdmissionLinkBEToFE(response.data.data) };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  update: async (id: string, linkData: Partial<AdmissionLinkFormData>): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/admin/masg/${id}`, linkData);
      if (response.data.success && response.data.data) {
         return { ...response.data, data: mapAdmissionLinkBEToFE(response.data.data) };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete(`/admin/masg/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default admissionLinkAdminService;