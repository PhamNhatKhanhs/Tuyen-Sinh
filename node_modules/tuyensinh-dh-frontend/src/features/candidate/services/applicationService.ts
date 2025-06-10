import axiosInstance from '../../../lib/axios';
import { UniversityFE } from '../../university/types';
import { MajorFE } from '../../major/types';
import { AdmissionMethodFE } from '../../admissionMethod/types';
import { SubjectGroupFE } from '../../subjectGroup/types';
import { UploadedFileResponse } from '../../upload/types'; // Giả sử type này đã được định nghĩa

// Kiểu dữ liệu cho một hồ sơ từ Backend (có thể cần mở rộng)
export interface ApplicationDetailBE { 
  _id: string;
  candidate: string; // User ID
  candidateProfileSnapshot: any;
  university: UniversityFE | string; // Có thể là ID hoặc populated object
  major: MajorFE | string;
  admissionMethod: AdmissionMethodFE | string;
  subjectGroup?: SubjectGroupFE | string;
  year: number;
  submissionDate: string;
  status: 'pending' | 'processing' | 'additional_required' | 'approved' | 'rejected' | 'cancelled';
  examScores?: any;
  documents: UploadedFileResponse[]; // Hoặc DocumentProofFE[] nếu bạn có type riêng
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListItemFE { // Dùng cho danh sách hồ sơ
    id: string;
    universityName: string;
    universityCode?: string;
    majorName: string;
    majorCode?: string;
    submissionDate: string;
    status: ApplicationDetailBE['status'];
    year: number;
}


interface SubmitApplicationData {
  personalInfo: any; 
  academicInfo: any; 
  applicationChoice: any; 
  examScores?: any;
  documentIds?: string[];
}

interface SubmitApplicationResponse {
  success: boolean;
  message?: string;
  data?: ApplicationDetailBE; 
}

interface GetMyApplicationsResponse {
    success: boolean;
    count?: number;
    data?: ApplicationDetailBE[]; // Backend trả về mảng ApplicationDetailBE
    message?: string;
}

interface GetMyApplicationByIdResponse {
    success: boolean;
    data?: ApplicationDetailBE;
    message?: string;
}


const applicationService = {
  submitApplication: async (data: SubmitApplicationData): Promise<SubmitApplicationResponse> => {
    try {
      const response = await axiosInstance.post<SubmitApplicationResponse>('/candidate/applications', data);
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi nộp hồ sơ." };
    }
  },

  getMyApplications: async (): Promise<{ success: boolean; data?: ApplicationListItemFE[]; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetMyApplicationsResponse>('/candidate/applications');
      if (response.data.success && response.data.data) {
        const applicationsFE: ApplicationListItemFE[] = response.data.data.map(app => ({
          id: app._id,
          universityName: typeof app.university === 'object' ? app.university.name : 'N/A',
          universityCode: typeof app.university === 'object' ? app.university.code : undefined,
          majorName: typeof app.major === 'object' ? app.major.name : 'N/A',
          majorCode: typeof app.major === 'object' ? app.major.code : undefined,
          submissionDate: new Date(app.submissionDate).toLocaleDateString('vi-VN'),
          status: app.status,
          year: app.year,
        }));
        return { success: true, data: applicationsFE };
      }
      return { success: false, message: response.data.message || "Không thể tải danh sách hồ sơ." };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách hồ sơ." };
    }
  },

  getMyApplicationById: async (id: string): Promise<{ success: boolean; data?: ApplicationDetailBE; message?: string }> => {
    try {
      const response = await axiosInstance.get<GetMyApplicationByIdResponse>(`/candidate/applications/${id}`);
      // Backend đã populate đủ, chỉ cần đảm bảo _id được map sang id nếu cần ở component chi tiết
      if (response.data.success && response.data.data) {
          // response.data.data.id = response.data.data._id; // Nếu component chi tiết dùng 'id'
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải chi tiết hồ sơ." };
    }
  },
};
export default applicationService;