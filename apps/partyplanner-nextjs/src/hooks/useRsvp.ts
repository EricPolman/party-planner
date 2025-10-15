import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { InviteeResponseStatus } from "@/types/invitees";
import { Invitation } from "@/types/invitations";

export function fetchRsvpInvitationByInvitationCode(
  invitationCode: string
): Promise<Omit<Invitation, "invitees">> {
  return axiosClient.get(`/rsvp/${invitationCode}`).then((res) => res.data);
}

export function useRsvpInvitationById(invitationCode: string) {
  return useQuery({
    queryKey: ["events", invitationCode],
    queryFn: async (): Promise<Omit<Invitation, "invitees">> => {
      return fetchRsvpInvitationByInvitationCode(invitationCode);
    },
  });
}

export function useRsvpReply() {
  return useMutation({
    mutationFn: async (rsvp: {
      invitationCode: string;
      email?: string;
      name: string;
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
