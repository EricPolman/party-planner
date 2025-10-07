import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import type { PlannerEvent } from "./useEvents";

import { axiosClient } from "@/lib/axios";

export function useCreateEvent() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Add your custom logic here
  return useMutation({
    mutationFn: async (newEvent: {
      title: string;
      invitationText: string;
      startDate: Date;
      endDate: Date;
      location: string;
    }) => {
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

export function useAddInvitee() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newInvitee: {
      eventId: number;
      email?: string;
      firstName: string;
      lastName?: string;
      phoneNumber?: string;
    }) => {
      const token = await getToken();
      const response = await axiosClient.post(
        `/events/${newInvitee.eventId}/invitees`,
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
    },
  });
}

export function useRemoveInvitee() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { eventId: number; inviteeId: number }) => {
      const token = await getToken();
      const response = await axiosClient.delete(
        `/events/${params.eventId}/invitees/${params.inviteeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
