import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitsService } from "../api/visitsService";
import type { FollowUpVisit } from "../types/visitTypes";

export const useVisits = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FollowUpVisit[]>({
    queryKey: ["visits"],
    queryFn: visitsService.getAll,
  });

  const createVisit = useMutation({
    mutationFn: visitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });

  return { data, isLoading, error, createVisit };
};
