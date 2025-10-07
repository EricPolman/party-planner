import { createFileRoute } from '@tanstack/react-router'
import { fetchRsvpEventById } from '@/hooks/useRsvp'
import { RsvpForm } from '@/components/RsvpReplyForm'

export const Route = createFileRoute('/rsvp/$eventId')({
  loader: async ({ params }) => {
    const { eventId } = params
    const event = await fetchRsvpEventById(eventId)
    return event
  },
  component: RouteComponent,
})

function RouteComponent() {
  const event = Route.useLoaderData()
  return (
    <div className="mx-auto space-y-6">
      <div className="p-4 border rounded">
        <strong>{event.title}</strong>
        <p>{event.invitationText}</p>
        <br />
        <table>
          <tbody>
            <tr>
              <td className="w-6">🕙 </td>
              <td>
                {new Date(event.startDate).toLocaleString()}
                {' - '}
                {new Date(event.endDate).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td>📍 </td>
              <td>{event.location}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <RsvpForm eventId={event.id} />
    </div>
  )
}
