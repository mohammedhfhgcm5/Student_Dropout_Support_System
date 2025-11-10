// src/api/guardianService.ts

import type { CreateGuardianDto, Guardian, UpdateGuardianDto } from "../types/guardianTypes";
import { apiClient } from "./apiConfig";

const baseURL = "/guardians";

export const guardianService = {
  /** 🔹 Get all guardians */
  async getAll(): Promise<Guardian[]> {
    const res = await apiClient.get(baseURL);
    return res.data;
  },

  /** 🔹 Get one guardian by ID */
  async getOne(id: number): Promise<Guardian> {
    const res = await apiClient.get(`${baseURL}/${id}`);
    return res.data;
  },

  /** 🔹 Create new guardian */
  async create(data: CreateGuardianDto): Promise<Guardian> {
    const res = await apiClient.post(baseURL, data);
    return res.data;
  },

  /** 🔹 Update guardian */
  async update(id: number, data: UpdateGuardianDto): Promise<Guardian> {
    const res = await apiClient.patch(`${baseURL}/${id}`, data);
    return res.data;
  },

  /** 🔹 Delete guardian */
  async remove(id: number): Promise<void> {
    await apiClient.delete(`${baseURL}/${id}`);
  },

  /** 🔹 Search guardians by name or national number */
  async search(query: string): Promise<Guardian[]> {
    const res = await apiClient.get(`${baseURL}/search`, {
      params: { q: query },
    });
    return res.data;
  },
};
