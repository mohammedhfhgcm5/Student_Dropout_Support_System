import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { donationsService } from "../api/donationsService";
import type { Donation } from "../types/donationTypes";

export const useDonations = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: donationsService.getAll,
  });

  const confirmDonation = useMutation({
    mutationFn: donationsService.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
  });

  return { data, isLoading, error, confirmDonation };
};
