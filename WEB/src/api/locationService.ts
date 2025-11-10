import type { CreateLocationDto, UpdateLocationDto } from "../types/locationTypes";
import { apiClient } from "./apiConfig";


const BASE_URL = "/locations";

export const locationService = {
  async getAll(): Promise<Location[]> {
    const res = await apiClient.get(BASE_URL);
    return res.data;
  },

  async getOne(id: number): Promise<Location> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateLocationDto): Promise<Location> {
    const res = await apiClient.post(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateLocationDto): Promise<Location> {
    const res = await apiClient.patch(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  async search(query: string): Promise<Location[]> {
    const res = await apiClient.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
