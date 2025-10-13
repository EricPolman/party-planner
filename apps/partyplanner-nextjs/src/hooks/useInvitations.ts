import { axiosClient } from "@/lib/axios";
import { Invitation } from "@/types/invitations";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function fetchInvitations(token: string, eventId: string) {
  return axiosClient
    .get("/invitations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        eventId,
      },
    })
    .then((res) => res.data);
}

export function useInvitationsByEventId(eventId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["invitations", eventId],
    queryFn: async (): Promise<Array<Invitation>> => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      return fetchInvitations(token, eventId);
    },
  });
}

export function useCreateInvitation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Add your custom logic here
  return useMutation({
    mutationFn: async (newEvent: {
      eventId: string;
      title: string;
      message: string;
      startDate: Date;
      endDate: Date;
      location: string;
    }) => {
      const token = await getToken();

      const response = await axiosClient.post<Array<Invitation>>(
        `invitations`,
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useToggleInvitationActive() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Add your custom logic here
  return useMutation({
    mutationFn: async (updateParams: {
      eventId: string;
      isActive: boolean;
    }) => {
      const token = await getToken();

      const response = await axiosClient.put<Array<Invitation>>(
        `invitations/${updateParams.eventId}/isActive`,
        {
          isActive: updateParams.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
