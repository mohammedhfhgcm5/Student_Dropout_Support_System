import { api } from "@/services/http";
import type {
  CreateDonationPurposeDto,
  DonationPurpose,
} from "@/types/donationPurpose";

export const getAllDonationPurposes = async () => {
  const { data } = await api.get<DonationPurpose[]>("/donation-purposes");
  return Array.isArray(data) ? data : [];
};

export const searchDonationPurposes = async (
  q: string,
  skip = 0,
  limit = 10
) => {
  const { data } = await api.get<DonationPurpose[]>("/donation-purposes/search", {
    params: { q, skip, limit },
  });
  return Array.isArray(data) ? data : [];
};

export const createDonationPurpose = async (dto: CreateDonationPurposeDto) => {
  const { data } = await api.post<DonationPurpose>("/donation-purposes", dto);
  return data;
};
