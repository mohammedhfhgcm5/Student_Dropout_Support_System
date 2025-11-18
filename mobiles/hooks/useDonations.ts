import {
  deleteDonation,
  getAllDonations,
  getDonationById,
  getDonationsByDonor,
  simulatePayment,
} from "@/services/donation.service";
import type { CreateDonationDto } from "@/types/donation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDonations = () =>
  useQuery({
    queryKey: ["donations"],
    queryFn: getAllDonations,
  });

export const useDonation = (id: number) =>
  useQuery({
    queryKey: ["donation", id],
    queryFn: () => getDonationById(id),
    enabled: !!id,
  });

export const useDonorDonations = (donorId: number) =>
  useQuery({
    queryKey: ["donor-donations", donorId],
    queryFn: () => getDonationsByDonor(donorId),
    enabled: !!donorId,
  });

export const useSimulatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDonationDto) => simulatePayment(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donations"] }),
  });
};

export const useDeleteDonation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDonation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donations"] }),
  });
};
