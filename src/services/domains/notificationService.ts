import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}
interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
export const notificationsService = {
  async getNotifications(): Promise<ApiResponse<NotificationResponse>> {
    try {
      const response = await api.get(API_ROUTES.NOTIFICATIONS.ME);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    try {
      const response = await api.patch(
        API_ROUTES.NOTIFICATIONS.MARK_AS_READ({ id })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.patch(
        API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
