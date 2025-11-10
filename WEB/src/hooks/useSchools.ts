import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService } from "../api/schoolService";
import type { CreateSchoolDto, UpdateSchoolDto } from "../types/schoolTypes";

export const useSchools = () =>
  useQuery({
    queryKey: ["schools"],
    queryFn: schoolService.getAll,
  });

export const useCreateSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSchoolDto) => schoolService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schools"] }),
  });
};

export const useUpdateSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolDto }) =>
      schoolService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schools"] }),
  });
};

export const useDeleteSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => schoolService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schools"] }),
  });
};
