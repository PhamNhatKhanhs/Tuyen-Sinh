import axiosInstance from '../../../lib/axios';
import { MajorBE, MajorFE } from '../types';

interface GetAllMajorsResponse {
  success: boolean;
  count?: number;
  total?: number;
  data?: MajorBE[];
  message?: string;
}

const majorService = {
  getByUniversityId: async (universityId: string): Promise<{ success: boolean; data?: MajorFE[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllMajorsResponse>(`/majors`, { params: { universityId } });
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
        return { success: true, data: majorsFE };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách ngành." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách ngành." };
    }
  },
};
export default majorService;