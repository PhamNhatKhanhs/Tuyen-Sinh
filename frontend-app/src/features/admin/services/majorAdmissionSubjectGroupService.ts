import axiosInstance from '../../../lib/axios';

// Backend types based on the controller structure
interface MajorAdmissionSubjectGroupBE {
  _id: string;
  major: string | {
    _id: string;
    name: string;
    code: string;
    university: string | {
      _id: string;
      name: string;
      code: string;
    };
  };
  admissionMethod: string | {
    _id: string;
    name: string;
    code?: string;
  };
  subjectGroup: string | {
    _id: string;
    code: string;
    name: string;
    subjects: string[];
  };
  year: number;
  minScoreRequired?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend display type (matches the component interface)
export interface MajorSubjectGroupLinkFE {
  id: string;
  majorId: string;
  majorName: string;
  majorCode: string;
  universityName: string;
  admissionMethodId: string;
  admissionMethodName: string;
  subjectGroupId: string;
  subjectGroupCode: string;
  subjectGroupName: string;
  year: number;
  minScoreRequired?: number;
  isActive: boolean;
}

// Form data type (matches the component interface)
export interface LinkFormData {
  majorId: string;
  admissionMethodId: string;
  subjectGroupId: string;
  year: number;
  minScoreRequired?: number;
  isActive: boolean;
}

// Response types
interface GetLinksResponse {
  success: boolean;
  count?: number;
  total?: number;
  data?: MajorAdmissionSubjectGroupBE[];
  message?: string;
}

interface LinkResponse {
  success: boolean;
  data?: MajorAdmissionSubjectGroupBE;
  message?: string;
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

interface UniversitiesResponse {
  success: boolean;
  data?: Array<{ _id: string; name: string; code: string }>;
  message?: string;
}

interface MajorsResponse {
  success: boolean;
  data?: Array<{ _id: string; name: string; code: string; university: string }>;
  message?: string;
}

interface AdmissionMethodsResponse {
  success: boolean;
  data?: Array<{ _id: string; name: string; code?: string }>;
  message?: string;
}

interface SubjectGroupsResponse {
  success: boolean;
  data?: Array<{ _id: string; code: string; name: string; subjects: string[] }>;
  message?: string;
}

// Mapping function to convert backend data to frontend format
const mapLinkBEToFE = (linkBE: MajorAdmissionSubjectGroupBE): MajorSubjectGroupLinkFE => {
  // Handle major
  let majorId = '';
  let majorName = 'N/A';
  let majorCode = 'N/A';
  let universityName = 'N/A';
  
  if (typeof linkBE.major === 'object' && linkBE.major !== null) {
    majorId = linkBE.major._id;
    majorName = linkBE.major.name;
    majorCode = linkBE.major.code;
    
    if (typeof linkBE.major.university === 'object' && linkBE.major.university !== null) {
      universityName = linkBE.major.university.name;
    }
  } else if (typeof linkBE.major === 'string') {
    majorId = linkBE.major;
    majorName = `Major ID: ${linkBE.major.slice(-6)}`;
  }

  // Handle admission method
  let admissionMethodId = '';
  let admissionMethodName = 'N/A';
  
  if (typeof linkBE.admissionMethod === 'object' && linkBE.admissionMethod !== null) {
    admissionMethodId = linkBE.admissionMethod._id;
    admissionMethodName = linkBE.admissionMethod.name;
  } else if (typeof linkBE.admissionMethod === 'string') {
    admissionMethodId = linkBE.admissionMethod;
    admissionMethodName = `Method ID: ${linkBE.admissionMethod.slice(-6)}`;
  }

  // Handle subject group
  let subjectGroupId = '';
  let subjectGroupName = 'N/A';
  let subjectGroupCode = 'N/A';
  
  if (typeof linkBE.subjectGroup === 'object' && linkBE.subjectGroup !== null) {
    subjectGroupId = linkBE.subjectGroup._id;
    subjectGroupName = linkBE.subjectGroup.name;
    subjectGroupCode = linkBE.subjectGroup.code;
  } else if (typeof linkBE.subjectGroup === 'string') {
    subjectGroupId = linkBE.subjectGroup;
    subjectGroupName = `Group ID: ${linkBE.subjectGroup.slice(-6)}`;
  }

  return {
    id: linkBE._id,
    majorId,
    majorName,
    majorCode,
    universityName,
    admissionMethodId,
    admissionMethodName,
    subjectGroupId,
    subjectGroupCode,
    subjectGroupName,
    year: linkBE.year,
    minScoreRequired: linkBE.minScoreRequired,
    isActive: linkBE.isActive,
  };
};

const majorAdmissionSubjectGroupService = {
  // Get all links with filters and pagination
  getAll: async (params?: {
    universityId?: string;
    majorId?: string;
    admissionMethodId?: string;
    subjectGroupId?: string;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data?: MajorSubjectGroupLinkFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetLinksResponse>('/admin/major-admission-subject-groups', { params });
      
      if (response.data.success && response.data.data) {
        const linksFE: MajorSubjectGroupLinkFE[] = response.data.data.map(mapLinkBEToFE);
        return {
          success: true,
          data: linksFE,
          total: response.data.total || response.data.count || linksFE.length,
        };
      }
      return { success: false, message: response.data.message || 'Không thể tải danh sách liên kết.' };
    } catch (error: any) {
      console.error('Service getAll error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tải danh sách liên kết.' };
    }
  },

  // Create new link
  create: async (linkData: LinkFormData): Promise<{ success: boolean; data?: MajorSubjectGroupLinkFE; message?: string }> => {
    try {
      const payload = {
        majorId: linkData.majorId,
        admissionMethodId: linkData.admissionMethodId,
        subjectGroupId: linkData.subjectGroupId,
        year: linkData.year,
        minScoreRequired: linkData.minScoreRequired || 0,
        isActive: linkData.isActive !== false, // Default to true
      };
      
      const response = await axiosInstance.post<LinkResponse>('/admin/major-admission-subject-groups', payload);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: mapLinkBEToFE(response.data.data),
        };
      }
      return { success: false, message: response.data.message || 'Không thể tạo liên kết.' };
    } catch (error: any) {
      console.error('Service create error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tạo liên kết.' };
    }
  },

  // Update existing link
  update: async (id: string, linkData: Partial<LinkFormData>): Promise<{ success: boolean; data?: MajorSubjectGroupLinkFE; message?: string }> => {
    try {
      const response = await axiosInstance.put<LinkResponse>(`/admin/major-admission-subject-groups/${id}`, linkData);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: mapLinkBEToFE(response.data.data),
        };
      }
      return { success: false, message: response.data.message || 'Không thể cập nhật liên kết.' };
    } catch (error: any) {
      console.error('Service update error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi cập nhật liên kết.' };
    }
  },

  // Delete link
  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<DeleteResponse>(`/admin/major-admission-subject-groups/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Service delete error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi xóa liên kết.' };
    }
  },

  // Helper methods for loading options
  getUniversities: async (): Promise<{ success: boolean; data?: Array<{ id: string; name: string; code: string }>; message?: string }> => {
    try {
      const response = await axiosInstance.get<UniversitiesResponse>('/admin/universities');
      
      if (response.data.success && response.data.data) {
        const universities = response.data.data.map(uni => ({
          id: uni._id,
          name: uni.name,
          code: uni.code,
        }));
        return { success: true, data: universities };
      }
      return { success: false, message: response.data.message || 'Không thể tải danh sách trường đại học.' };
    } catch (error: any) {
      console.error('Service getUniversities error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tải danh sách trường đại học.' };
    }
  },

  getMajorsByUniversity: async (universityId: string): Promise<{ success: boolean; data?: Array<{ id: string; name: string; code: string; universityId: string }>; message?: string }> => {
    try {
      const response = await axiosInstance.get<MajorsResponse>(`/admin/majors?universityId=${universityId}`);
      
      if (response.data.success && response.data.data) {
        const majors = response.data.data.map(major => ({
          id: major._id,
          name: major.name,
          code: major.code,
          universityId: major.university,
        }));
        return { success: true, data: majors };
      }
      return { success: false, message: response.data.message || 'Không thể tải danh sách ngành học.' };
    } catch (error: any) {
      console.error('Service getMajorsByUniversity error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tải danh sách ngành học.' };
    }
  },

  getAdmissionMethods: async (): Promise<{ success: boolean; data?: Array<{ id: string; name: string; code: string }>; message?: string }> => {
    try {
      const response = await axiosInstance.get<AdmissionMethodsResponse>('/admin/admission-methods');
      
      if (response.data.success && response.data.data) {
        const methods = response.data.data.map(method => ({
          id: method._id,
          name: method.name,
          code: method.code || '',
        }));
        return { success: true, data: methods };
      }
      return { success: false, message: response.data.message || 'Không thể tải danh sách phương thức xét tuyển.' };
    } catch (error: any) {
      console.error('Service getAdmissionMethods error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tải danh sách phương thức xét tuyển.' };
    }
  },

  getSubjectGroups: async (): Promise<{ success: boolean; data?: Array<{ id: string; name: string; code: string; subjects: string[] }>; message?: string }> => {
    try {
      const response = await axiosInstance.get<SubjectGroupsResponse>('/admin/subject-groups');
      
      if (response.data.success && response.data.data) {
        const groups = response.data.data.map(group => ({
          id: group._id,
          name: group.name,
          code: group.code,
          subjects: group.subjects,
        }));
        return { success: true, data: groups };
      }
      return { success: false, message: response.data.message || 'Không thể tải danh sách tổ hợp môn.' };
    } catch (error: any) {
      console.error('Service getSubjectGroups error:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Lỗi khi tải danh sách tổ hợp môn.' };
    }
  },
};

export default majorAdmissionSubjectGroupService;
