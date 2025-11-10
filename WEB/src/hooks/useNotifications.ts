import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../api/notificationsService";
import type { Notification } from "../types/notificationTypes";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: notificationsService.getAll,
  });

//   const markAsRead = useMutation({
//     mutationFn: (id: number) => notificationsService.markAsRead(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

  return { data, isLoading, error,};
};
