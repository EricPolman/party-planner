import { axiosClient } from "@/lib/axios";
import { Invitation } from "@/types/invitations";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

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
