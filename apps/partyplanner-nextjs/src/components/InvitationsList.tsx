"use client";

import { PlannerEvent } from "@/types/events";
import { useInvitationsByEventId } from "@/hooks/useInvitations";
import { InvitationDetails } from "./InvitationDetail";
import { useState } from "react";
import { Invitation } from "@/types/invitations";
import { InviteeStatusBadge } from "./InviteeStatusBadge";
import { InviteeResponseStatus } from "@/types/invitees";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

function InvitationListItem({
  invitation,
  plannerEvent,
}: {
  invitation: Invitation;
  plannerEvent: PlannerEvent;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full border rounded px-4 flex flex-col bg-slate-50">
      <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
        <h2 className="text-xl font-semibold mb-2">{invitation.title}</h2>
        <div>
          <div className="flex flex-col md:flex-row gap-6 my-4 text-sm md:text-base">
            <div className="flex flex-row gap-2 items-center">
              <InviteeStatusBadge status={InviteeResponseStatus.ACCEPTED} />
              <span>
                {
                  invitation.invitees.filter(
                    (invitee) =>
                      invitee.status === InviteeResponseStatus.ACCEPTED
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <InviteeStatusBadge status={InviteeResponseStatus.DECLINED} />
              <span>
                {
                  invitation.invitees.filter(
                    (invitee) =>
                      invitee.status === InviteeResponseStatus.DECLINED
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <InviteeStatusBadge status={InviteeResponseStatus.MAYBE} />
              <span>
                {
                  invitation.invitees.filter(
                    (invitee) => invitee.status === InviteeResponseStatus.MAYBE
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <InviteeStatusBadge status={InviteeResponseStatus.PENDING} />
              <span>
                {
                  invitation.invitees.filter(
                    (invitee) =>
                      invitee.status === InviteeResponseStatus.PENDING
                  ).length
                }
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <InvitationDetails
          invitation={invitation}
          plannerEvent={plannerEvent}
        />
      )}
    </div>
  );
}

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
    return <div>Laden...</div>;
  }

  if (error) {
    return <div>Er is een fout opgetreden!</div>;
  }

  if (!invitations || invitations.length === 0) {
    return <div>Er zijn nog geen uitnodigingen voor dit evenement.</div>;
  }

  return (
    <div className="flex flex-col w-full mb-3">
      {invitations.map((invitation) => (
        <InvitationListItem
          key={invitation.id}
          invitation={invitation}
          plannerEvent={plannerEvent}
        />
      ))}
    </div>
  );
}
