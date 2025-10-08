"use client";

import { PlannerEvent } from "@/types/events";
import { useInvitationsByEventId } from "@/hooks/useInvitations";
import { InvitationDetails } from "./InvitationDetail";

export function InvitationsList({
  plannerEvent,
}: {
  plannerEvent: PlannerEvent;
}) {
  const {
    data: invitations,
    isLoading,
    error,
  } = useInvitationsByEventId(plannerEvent.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  if (!invitations || invitations.length === 0) {
    return <div>No invitations found</div>;
  }

  return (
    <div className="flex flex-col w-full">
      {invitations.map((invitation) => (
        <InvitationDetails
          key={invitation.id}
          invitation={invitation}
          plannerEvent={plannerEvent}
        />
      ))}
    </div>
  );
}
