import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { axiosClient } from "@/lib/axios";
import { PlannerEvent, PlannerEventListItem } from "@/types/events";

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
    queryFn: async (): Promise<Array<PlannerEventListItem & { organisers: Array<{ firstName: string; lastName: string; email: string; }> }> > => {
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
