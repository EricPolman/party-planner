import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  PlannerEventInviteeResponseStatus,
  PlannerEventListItem,
} from './useEvents'
import { axiosClient } from '@/lib/axios'

export function fetchRsvpEventById(id: string): Promise<PlannerEventListItem> {
  return axiosClient.get(`/rsvp/${id}`).then((res) => res.data)
}

export function useRsvpEventById(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async (): Promise<PlannerEventListItem> => {
      return fetchRsvpEventById(id)
    },
  })
}

export function useRsvpReply() {
  return useMutation({
    mutationFn: async (rsvp: {
      eventId: number
      email?: string
      firstName: string
      lastName?: string
      phoneNumber?: string
      status: PlannerEventInviteeResponseStatus
      comments?: string
    }) => {
      return axiosClient
        .post(`/rsvp/${rsvp.eventId}`, rsvp)
        .then((res) => res.data)
    },
  })
}
