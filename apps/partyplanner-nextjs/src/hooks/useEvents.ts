import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { axiosClient } from "@/lib/axios";

export enum PlannerEventInviteeResponseStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  MAYBE = "MAYBE",
  PENDING = "PENDING",
}

export interface PlannerEventInvitee {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string | null;
  status: PlannerEventInviteeResponseStatus;
  comments: string | null;
  respondedAt: string | null;
}

export interface PlannerEventListItem {
  id: number;
  title: string;
  invitationText: string;
  startDate: string;
  endDate: string;
  location: string | null;
}

export interface PlannerEvent extends PlannerEventListItem {
  invitees: Array<PlannerEventInvitee>;
}

export function fetchEvents(token: string) {
  return axiosClient
    .get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}

export function fetchEventById(token: string, id: string) {
  return axiosClient
    .get(`/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}

export function usePlannerEvents() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Array<PlannerEventListItem>> => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      return fetchEvents(token);
    },
  });
}

export function usePlannerEventById(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["events", id],
    queryFn: async (): Promise<PlannerEvent> => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      return fetchEventById(token, id);
    },
  });
}
