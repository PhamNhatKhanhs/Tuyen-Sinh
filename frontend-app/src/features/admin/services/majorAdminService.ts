import axiosInstance from '../../../lib/axios';
import type { MajorFE, MajorBE } from '../../major/types';
import { UniversityFE } from '../../university/types';

interface AdminMajorResponse {
  success: boolean;
  data?: MajorBE | MajorFE;
  message?: string;
}
interface AdminGetAllMajorsResponse {
  success: boolean;
  count?: number;
  total?: number;
  data?: MajorBE[];
  message?: string;
}

const majorAdminService = {  getUniversitiesForSelect: async (): Promise<{ success: boolean; data?: Pick<UniversityFE, 'id' | 'name' | 'code'>[]; message?: string }> => {
    try {
      console.log('Fetching universities from /admin/universities...');
      const response = await axiosInstance.get<any>('/admin/universities', { 
        params: { limit: 1000, sortBy: 'name' } 
      }); 
      
      console.log('Universities response:', response.data);
      
      // Check different response structures that backend might return
      if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
        const universities = response.data.data.map((u: any) => ({ 
          id: u._id || u.id, 
          name: u.name, 
          code: u.code 
        }));
        console.log('Mapped universities:', universities);
        return { success: true, data: universities };
      } else if (Array.isArray(response.data)) {
        // Direct array response
        const universities = response.data.map((u: any) => ({ 
          id: u._id || u.id, 
          name: u.name, 
          code: u.code 
        }));
        console.log('Mapped universities (direct array):', universities);
        return { success: true, data: universities };
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Data is nested but no success field
        const universities = response.data.data.map((u: any) => ({ 
          id: u._id || u.id, 
          name: u.name, 
          code: u.code 
        }));
        console.log('Mapped universities (nested):', universities);
        return { success: true, data: universities };
      }
      
      console.log('No valid universities found in response');
      return { success: false, message: "Không thể tải danh sách trường." };
    } catch (error: any) {
      console.error('Error fetching universities:', error);
      return { success: false, message: error.response?.data?.message || "Lỗi khi tải danh sách trường." };
    }
  },

  getAll: async (params?: { universityId?: string; search?: string; page?: number; limit?: number; sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<{ success: boolean; data?: MajorFE[]; total?: number; message?: string }> => {
    try {
      const response = await axiosInstance.get<AdminGetAllMajorsResponse>('/admin/majors', { params });
      if (response.data.success && response.data.data) {
        const majorsFE: MajorFE[] = response.data.data.map(major => ({
          id: major._id,
          name: major.name,
          code: major.code,
          universityId: typeof major.university === 'string' ? major.university : major.university._id,
          universityName: typeof major.university === 'object' ? major.university.name : undefined,
          description: major.description,
          admissionQuota: major.admissionQuota,
          isActive: major.isActive,
        }));
        return { success: true, data: majorsFE, total: response.data.total };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách ngành (Admin)." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách ngành (Admin)." };
    }
  },  create: async (majorData: { name: string; code: string; description?: string; admissionQuota?: number; isActive?: boolean; university: string }): Promise<AdminMajorResponse> => { 
    try {
      console.log('Creating major with data:', majorData);
      
      // Prepare payload for backend
      const payload = {
        name: majorData.name,
        code: majorData.code,
        description: majorData.description,
        admissionQuota: majorData.admissionQuota || 0,
        isActive: majorData.isActive !== false,
        universityId: majorData.university // Backend expects universityId field
      };
      
      console.log('Sending payload:', payload);
      
      const response = await axiosInstance.post<AdminMajorResponse>('/admin/majors', payload);
      
      console.log('Create response:', response.data);
      
      if (response.data.success && response.data.data) {
        const majorBE = response.data.data as MajorBE;
        return { 
          ...response.data, 
          data: { 
            ...majorBE, 
            id: majorBE._id, 
            universityId: typeof majorBE.university === 'string' ? majorBE.university : majorBE.university._id 
          } as MajorFE 
        };
      }
      return response.data;
    } catch (error: any) {
      console.error('Create major error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi tạo ngành học'
      };
    }
  },

  update: async (id: string, majorData: Partial<Omit<MajorFE, 'id' | 'universityId' | 'universityName'>>): Promise<AdminMajorResponse> => {
    try {
      const response = await axiosInstance.put<AdminMajorResponse>(`/admin/majors/${id}`, majorData);
       if (response.data.success && response.data.data) {
        const majorBE = response.data.data as MajorBE;
        return { ...response.data, data: { ...majorBE, id: majorBE._id, universityId: typeof majorBE.university === 'string' ? majorBE.university : majorBE.university._id } as MajorFE };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/admin/majors/${id}`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
export default majorAdminService;
