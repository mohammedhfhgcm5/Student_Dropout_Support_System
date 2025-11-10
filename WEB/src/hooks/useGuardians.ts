// src/hooks/useGuardians.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guardianService } from "../api/guardianService";
import type { UpdateGuardianDto } from "../types/guardianTypes";

// ✅ Fetch all guardians
export const useGuardians = () =>
  useQuery({
    queryKey: ["guardians"],
    queryFn: guardianService.getAll,
  });

// ✅ Get one guardian by ID
export const useGuardian = (id: number) =>
  useQuery({
    queryKey: ["guardian", id],
    queryFn: () => guardianService.getOne(id),
    enabled: !!id,
  });

// ✅ Create new guardian
export const useCreateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
  });
};

// ✅ Update guardian
export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGuardianDto }) =>
      guardianService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
  });
};

// ✅ Delete guardian
export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
  });
};

// ✅ Search guardians
export const useSearchGuardians = (query: string) =>
  useQuery({
    queryKey: ["guardians", "search", query],
    queryFn: () => guardianService.search(query),
    enabled: query.length > 1,
  });
