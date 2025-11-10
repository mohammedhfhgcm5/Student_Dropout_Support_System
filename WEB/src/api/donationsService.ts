import { apiClient } from "./apiConfig";
import type{ Donation } from "../types/donationTypes";

export const donationsService = {
  getAll: async (): Promise<Donation[]> => {
    const res = await apiClient.get("/donations");
    return res.data;
  },

  confirm: async (id: number): Promise<Donation> => {
    const res = await apiClient.patch(`/donations/${id}/confirm`);
    return res.data;
  },
};
