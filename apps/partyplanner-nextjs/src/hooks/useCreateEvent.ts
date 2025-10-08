import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

import { axiosClient } from "@/lib/axios";
import { PlannerEvent } from "@/types/events";

export function useCreateEvent() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Add your custom logic here
  return useMutation({
    mutationFn: async (newEvent: { title: string; description: string }) => {
      const token = await getToken();

      const response = await axiosClient.post<PlannerEvent>(
        "/events",
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
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

      const response = await axiosClient.post<PlannerEvent>(
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

export function useAddInvitee() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newInvitee: {
      invitationId: string;
      email?: string;
      firstName: string;
      lastName?: string;
      phoneNumber?: string;
    }) => {
      const token = await getToken();
      const response = await axiosClient.post(
        `/invitations/${newInvitee.invitationId}/invitees`,
        newInvitee,
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

export function useRemoveInvitee() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { invitationId: string; inviteeId: string }) => {
      const token = await getToken();
      const response = await axiosClient.delete(
        `/invitations/${params.invitationId}/invitees/${params.inviteeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}
