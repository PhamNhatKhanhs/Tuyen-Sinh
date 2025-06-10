import axiosInstance from '../../../lib/axios';
import { NotificationFE } from '../types';

interface GetNotificationsResponse {
  success: boolean;
  count?: number;
  total?: number;
  pagination?: any;
  data?: NotificationFE[]; // Giả sử BE trả về đã map _id -> id, hoặc cần map ở đây
  message?: string;
}

interface MarkReadResponse {
  success: boolean;
  data?: NotificationFE; // Thông báo đã được cập nhật
  message?: string;
}

interface MarkAllReadResponse {
  success: boolean;
  message?: string;
}

// Helper để map _id từ BE sang id cho FE nếu cần
const mapNotificationBEToFE = (notificationBE: any): NotificationFE => ({
    ...notificationBE,
    id: notificationBE._id,
});


const notificationService = {
  getMyNotifications: async (params?: { page?: number; limit?: number }): Promise<GetNotificationsResponse> => {
    try {
      const response = await axiosInstance.get<GetNotificationsResponse>('/notifications', { params });
      if (response.data.success && response.data.data) {
        // Giả sử BE trả về _id, cần map sang id
        response.data.data = response.data.data.map(mapNotificationBEToFE);
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi tải thông báo." };
    }
  },

  markAsRead: async (notificationId: string): Promise<MarkReadResponse> => {
    try {
      const response = await axiosInstance.patch<MarkReadResponse>(`/notifications/${notificationId}/mark-read`);
       if (response.data.success && response.data.data) {
        response.data.data = mapNotificationBEToFE(response.data.data);
      }
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi đánh dấu đã đọc." };
    }
  },

  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    try {
      const response = await axiosInstance.patch<MarkAllReadResponse>('/notifications/mark-all-read');
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || "Lỗi khi đánh dấu tất cả đã đọc." };
    }
  },
};
export default notificationService;
