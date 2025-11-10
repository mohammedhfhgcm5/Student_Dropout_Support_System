import { apiClient } from "./apiConfig";
import type { User } from "../types/userTypes";

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get("/users");
    return res.data;
  },

  create: async (data: Partial<User>): Promise<User> => {
    const res = await apiClient.post("/users", data);
    return res.data;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await apiClient.patch(`/users/${id}`, data);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
