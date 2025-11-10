import { apiClient } from "./apiConfig";
import  type { FollowUpVisit } from "../types/visitTypes";

export const visitsService = {
  getAll: async (): Promise<FollowUpVisit[]> => {
    const res = await apiClient.get("/visits");
    return res.data;
  },

  create: async (data: Partial<FollowUpVisit>): Promise<FollowUpVisit> => {
    const res = await apiClient.post("/visits", data);
    return res.data;
  },
};
