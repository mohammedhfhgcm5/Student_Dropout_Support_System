import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dropoutReasonService } from "../api/dropoutReasonService";
import type { DropoutReason } from "../types/dropoutReasonTypes";

export const useDropoutReasons = () =>
  useQuery<DropoutReason[]>({
    queryKey: ["dropout-reasons"],
    queryFn: dropoutReasonService.getAll,
  });

export const useCreateDropoutReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dropoutReasonService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dropout-reasons"] }),
  });
};

export const useUpdateDropoutReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DropoutReason> }) =>
      dropoutReasonService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dropout-reasons"] }),
  });
};

export const useDeleteDropoutReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dropoutReasonService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dropout-reasons"] }),
  });
};

export const useSearchDropoutReasons = (query: string) =>
  useQuery<DropoutReason[]>({
    queryKey: ["dropout-reasons", "search", query],
    queryFn: () => dropoutReasonService.search(query),
    enabled: !!query,
  });
