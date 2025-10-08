import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { PlannerEventListItem } from "@/types/events";
import { InviteeResponseStatus } from "@/types/invitees";

export function fetchRsvpEventByInvitationCode(
  invitationCode: string
): Promise<PlannerEventListItem> {
  return axiosClient.get(`/rsvp/${invitationCode}`).then((res) => res.data);
}

export function useRsvpEventById(invitationCode: string) {
  return useQuery({
    queryKey: ["events", invitationCode],
    queryFn: async (): Promise<PlannerEventListItem> => {
      return fetchRsvpEventByInvitationCode(invitationCode);
    },
  });
}

export function useRsvpReply() {
  return useMutation({
    mutationFn: async (rsvp: {
      invitationCode: string;
      email?: string;
      firstName: string;
      lastName?: string;
      phoneNumber?: string;
      status: InviteeResponseStatus;
      comments?: string;
    }) => {
      return axiosClient
        .post(`/rsvp/${rsvp.invitationCode}`, rsvp)
        .then((res) => res.data);
    },
  });
}
