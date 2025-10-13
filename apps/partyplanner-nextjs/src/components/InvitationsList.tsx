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
import { cn } from "@/lib/utils";

function InvitationListItem({ invitation }: { invitation: Invitation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "w-full border rounded px-4 flex flex-col",
        isExpanded && "bg-slate-50"
      )}
    >
      <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
        <h2 className="text-xl font-semibold mb-2">
          {invitation.title}{" "}
          <span className="text-sm text-muted-foreground ml-3 italic">
            {invitation.isActive ? "Open" : "Gesloten"}
          </span>
        </h2>
        <div>
          <div className="md:flex md:flex-row md:gap-6 my-4 space-y-3 space-x-3 text-sm md:text-base">
            <div className="inline-block md:flex flex-row gap-2 items-center">
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
            <div className="inline-block md:flex flex-row gap-2 items-center">
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
            <div className="inline-block md:flex flex-row gap-2 items-center">
              <InviteeStatusBadge status={InviteeResponseStatus.MAYBE} />
              <span>
                {
                  invitation.invitees.filter(
                    (invitee) => invitee.status === InviteeResponseStatus.MAYBE
                  ).length
                }
              </span>
            </div>
            <div className="inline-block md:flex flex-row gap-2 items-center">
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
      {isExpanded && <InvitationDetails invitation={invitation} />}
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
        <InvitationListItem key={invitation.id} invitation={invitation} />
      ))}
    </div>
  );
}
