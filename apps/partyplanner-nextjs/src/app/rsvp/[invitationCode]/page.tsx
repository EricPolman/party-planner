import { InvitationCard } from "@/components/InvitationCard";
import { RsvpForm } from "@/components/RsvpReplyForm";
import { fetchRsvpInvitationByInvitationCode } from "@/hooks/useRsvp";

// Metadata should include event title if possible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;
  const event = await fetchRsvpInvitationByInvitationCode(invitationCode);
  return { title: event?.title || "RSVP", description: event?.message };
}

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;

  const invitation = await fetchRsvpInvitationByInvitationCode(invitationCode);

  return (
    <div className="mx-auto space-y-6 max-w-xl p-4">
      <InvitationCard invitation={invitation} />
      <RsvpForm invitationCode={invitationCode} />
    </div>
  );
}
