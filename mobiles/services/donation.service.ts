import { api } from "@/services/http";
import { Donation, CreateDonationDto } from "@/types/donation";

export const getAllDonations = async () => {
  const { data } = await api.get<Donation[]>("/donations");
  return Array.isArray(data) ? data : [];
};

export const getDonationById = async (id: number) => {
  const { data } = await api.get<Donation>(`/donations/${id}`);
  return data;
};

export const getDonationsByDonor = async (donorId: number) => {
  const { data } = await api.get<Donation[]>(`/donors/${donorId}/donations`);
  return Array.isArray(data) ? data : [];
};

export const simulatePayment = async (dto: CreateDonationDto) => {
  const { data } = await api.post("/donations/simulate-payment", dto);
  return data;
};

export const deleteDonation = async (id: number) => {
  const { data } = await api.delete(`/donations/${id}`);
  return data;
};
