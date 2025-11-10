import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationService } from "../api/locationService";
import type { CreateLocationDto, UpdateLocationDto } from "../types/locationTypes";

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

export const useCreateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLocationDto) => locationService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useUpdateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLocationDto }) =>
      locationService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useDeleteLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => locationService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};
