import type { DropoutReason } from "../types/dropoutReasonTypes";
import { apiClient } from "./apiConfig";

const API_URL = "/dropout-reasons";

export const dropoutReasonService = {
  async getAll(): Promise<DropoutReason[]> {
    const res = await apiClient.get(API_URL);
    return res.data ?? res;
  },

  async getOne(id: number): Promise<DropoutReason> {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return res.data ?? res;
  },

  async create(data: Omit<DropoutReason, "id">): Promise<DropoutReason> {
    const token = localStorage.getItem("access_token");
    const res = await apiClient.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? res;
  },

  async update(id: number, data: Partial<DropoutReason>): Promise<DropoutReason> {
    const token = localStorage.getItem("access_token");
    const res = await apiClient.patch(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? res;
  },

  async remove(id: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    const res = await apiClient.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? res;
  },

  async search(q: string): Promise<DropoutReason[]> {
    const res = await apiClient.get(`${API_URL}/search?q=${q}`);
    return res.data ?? res;
  },
};
