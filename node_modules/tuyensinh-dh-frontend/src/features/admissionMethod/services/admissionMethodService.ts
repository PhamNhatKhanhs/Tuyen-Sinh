import axiosInstance from '../../../lib/axios';
import { AdmissionMethodBE, AdmissionMethodFE } from '../types';

interface GetAllAdmissionMethodsResponse {
  success: boolean;
  count?: number;
  data?: AdmissionMethodBE[];
  message?: string;
}

const admissionMethodService = {
  getAll: async (): Promise<{ success: boolean; data?: AdmissionMethodFE[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetAllAdmissionMethodsResponse>('/admission-methods');
      if (response.data.success && response.data.data) {
        const methodsFE: AdmissionMethodFE[] = response.data.data.map(method => ({
          ...method,
          id: method._id,
        }));
        return { success: true, data: methodsFE };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách phương thức XT." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách phương thức XT." };
    }
  },
};
export default admissionMethodService;