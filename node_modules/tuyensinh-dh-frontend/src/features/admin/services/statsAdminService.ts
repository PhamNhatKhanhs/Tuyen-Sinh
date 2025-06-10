import axiosInstance from '../../../lib/axios';

export interface ApplicationOverviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  processing?: number;
  additional_required?: number;
  cancelled?: number;
}

export interface ApplicationsByUniversityStat {
  universityId: string;
  universityName: string;
  universityCode?: string;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
}

export interface ApplicationsByMajorStat {
  majorId: string;
  majorName: string;
  majorCode?: string;
  universityName?: string; // Thêm để biết ngành thuộc trường nào
  universityCode?: string;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
}

interface StatsResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const statsAdminService = {
  getApplicationOverview: async (): Promise<StatsResponse<ApplicationOverviewStats>> => {
    try {
      const response = await axiosInstance.get<StatsResponse<ApplicationOverviewStats>>('/admin/stats/applications/overview');
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải thống kê tổng quan." };
    }
  },

  getApplicationsByUniversity: async (): Promise<StatsResponse<ApplicationsByUniversityStat[]>> => {
    try {
      const response = await axiosInstance.get<StatsResponse<ApplicationsByUniversityStat[]>>('/admin/stats/applications/by-university');
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải thống kê theo trường." };
    }
  },

  getApplicationsByMajor: async (params?: { universityId?: string }): Promise<StatsResponse<ApplicationsByMajorStat[]>> => {
    try {
      const response = await axiosInstance.get<StatsResponse<ApplicationsByMajorStat[]>>('/admin/stats/applications/by-major', { params });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải thống kê theo ngành." };
    }
  },
};
export default statsAdminService;