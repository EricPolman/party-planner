import { InvitationCard } from "@/components/InvitationCard";
import { Header } from "@/components/Header";
import { RsvpForm } from "@/components/RsvpReplyForm";
import { fetchRsvpInvitationByInvitationCode } from "@/hooks/useRsvp";
import { isAxiosError } from "axios";
import { InvitationNotFoundCard } from "@/components/InvitationNotFoundCard";

// Metadata should include event title if possible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;
  try {
    const event = await fetchRsvpInvitationByInvitationCode(invitationCode);
    return { title: event?.title || "RSVP", description: event?.message };
  } catch (error) {
    return {
      title: "Evenement niet gevonden",
      description: "De uitnodiging met deze code bestaat niet of is verlopen.",
    };
  }
}

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ invitationCode: string }>;
}) {
  const { invitationCode } = await params;

  try {
    const invitation = await fetchRsvpInvitationByInvitationCode(
      invitationCode
    );

    return (
      <div>
        <Header />
        <div className="mx-auto space-y-6 max-w-xl p-4">
          <InvitationCard invitation={invitation} />
          <RsvpForm invitationCode={invitationCode} />
        </div>
      </div>
    );
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return (
        <div>
          <Header />
          <div className="mx-auto space-y-6 max-w-xl p-4">
            <InvitationNotFoundCard />
          </div>
        </div>
      );
    }
  }
}
