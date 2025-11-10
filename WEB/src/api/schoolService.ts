import type { CreateSchoolDto, School, UpdateSchoolDto } from "../types/schoolTypes";
import { apiClient } from "./apiConfig";


const BASE_URL = "/schools";

export const schoolService = {
  async getAll(): Promise<School[]> {
    const res = await apiClient.get(BASE_URL);
    return res.data;
  },

  async getOne(id: number): Promise<School> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateSchoolDto): Promise<School> {
    const res = await apiClient.post(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateSchoolDto): Promise<School> {
    const res = await apiClient.patch(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  async search(query: string): Promise<School[]> {
    const res = await apiClient.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
