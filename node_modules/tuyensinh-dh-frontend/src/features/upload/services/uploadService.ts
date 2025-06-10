import axiosInstance from '../../../lib/axios';
import { UploadedFileResponse } from '../types';

interface UploadServiceResponse {
    success: boolean;
    message?: string;
    data?: UploadedFileResponse;
}

const uploadService = {
  uploadDocument: async (file: File, documentType: string): Promise<UploadServiceResponse> => {
    const formData = new FormData();
    formData.append('documentFile', file); // 'documentFile' phải khớp với tên field ở middleware multer BE
    formData.append('documentType', documentType);

    try {
      const response = await axiosInstance.post<UploadServiceResponse>('/uploads/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải file lên." };
    }
  },
};
export default uploadService;