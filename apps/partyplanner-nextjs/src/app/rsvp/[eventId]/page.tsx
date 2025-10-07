import { fetchRsvpEventById } from "@/hooks/useRsvp";
import { RsvpForm } from "@/components/RsvpReplyForm";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await fetchRsvpEventById(eventId);

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
                {" - "}
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
  );
}
