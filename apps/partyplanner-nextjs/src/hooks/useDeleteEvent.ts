import { axiosClient } from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteEvent() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const token = await getToken();

      await axiosClient.delete(`/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate any queries related to events
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });
}
