import axiosInstance from '../../../lib/axios';
import { MajorBE, MajorFE } from '../types'; // Sử dụng lại type đã có
import { UniversityFE } from '../../university/types'; // Cần để lấy danh sách trường

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

const majorAdminService = {
  // Lấy danh sách trường để chọn khi thêm/sửa ngành (tạm thời để ở đây, có thể tách ra)
  getUniversitiesForSelect: async (): Promise<{ success: boolean; data?: Pick<UniversityFE, 'id' | 'name' | 'code'>[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<{success: boolean; data: UniversityFE[]}>('/admin/universities', { params: { limit: 1000, sortBy: 'name' } }); // Lấy nhiều trường
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data.map(u => ({ id: u.id, name: u.name, code: u.code })) };
      }
      return { success: false, message: "Không thể tải danh sách trường." };
    } catch (error: any) {
      return { success: false, message: "Lỗi khi tải danh sách trường." };
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
  },

  create: async (majorData: Omit<MajorFE, 'id' | 'universityName'> & { university: string }): Promise<AdminMajorResponse> => { // Đảm bảo university là string ID
    try {
      const response = await axiosInstance.post<AdminMajorResponse>('/admin/majors', majorData);
       if (response.data.success && response.data.data) {
        const majorBE = response.data.data as MajorBE;
        return { ...response.data, data: { ...majorBE, id: majorBE._id, universityId: typeof majorBE.university === 'string' ? majorBE.university : majorBE.university._id } as MajorFE };
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  update: async (id: string, majorData: Partial<Omit<MajorFE, 'id' | 'universityId' | 'universityName'>>): Promise<AdminMajorResponse> => {
    try {
      // Backend không cho update universityId của major qua API này
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