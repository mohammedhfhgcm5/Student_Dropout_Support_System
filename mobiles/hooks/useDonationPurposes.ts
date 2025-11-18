import {
  createDonationPurpose,
  getAllDonationPurposes,
  searchDonationPurposes,
} from "@/services/donationPurpose.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDonationPurposes = () =>
  useQuery({
    queryKey: ["donation-purposes"],
    queryFn: getAllDonationPurposes,
  });

export const useSearchDonationPurposes = (q: string, skip = 0, limit = 10) =>
  useQuery({
    queryKey: ["donation-purposes-search", q, skip, limit],
    queryFn: () => searchDonationPurposes(q, skip, limit),
    enabled: !!q,
  });

export const useCreateDonationPurpose = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDonationPurpose,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donation-purposes"] }),
  });
};
