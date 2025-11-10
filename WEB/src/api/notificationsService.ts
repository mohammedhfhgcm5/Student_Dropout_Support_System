import { apiClient } from "./apiConfig";
import type { Notification } from "../types/notificationTypes";

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await apiClient.get("/notifications");
    return res.data;
  },
};
