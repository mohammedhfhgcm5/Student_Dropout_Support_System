import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../api/usersService";
import type { User } from "../types/userTypes";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersService.getAll,
  });

  const createUser = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { data, isLoading, error, createUser, updateUser, deleteUser };
};
