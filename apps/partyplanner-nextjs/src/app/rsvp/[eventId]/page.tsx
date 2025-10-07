import { RsvpForm } from "@/components/RsvpReplyForm";
import { fetchRsvpEventById } from "@/hooks/useRsvp";

// Metadata should include event title if possible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  console.log("Generating metadata for eventId:", eventId);

  const event = await fetchRsvpEventById(eventId);
  console.log("Fetched event for metadata:", JSON.stringify(event));
  return { title: event?.title || "RSVP", description: event?.invitationText };
}

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  console.log("EventId:", eventId);

  const event = await fetchRsvpEventById(eventId);
  console.log("Fetched event for RSVPPage:", JSON.stringify(event));

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
