import { RsvpForm } from "@/components/RsvpReplyForm";
import { fetchRsvpEventByInvitationCode } from "@/hooks/useRsvp";

// Metadata should include event title if possible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;
  const event = await fetchRsvpEventByInvitationCode(invitationCode);
  return { title: event?.title || "RSVP", description: event?.description };
}

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;

  const event = await fetchRsvpEventByInvitationCode(invitationCode);

  return (
    <div className="mx-auto space-y-6">
      <div className="p-4 border rounded">
        <strong>{event.title}</strong>
      </div>
      <RsvpForm invitationCode={invitationCode} />
    </div>
  );
}
