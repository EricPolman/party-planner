"use client";

import { useRef } from "react";
import { TelegramIcon, TelegramShareButton } from "react-share";
import { TrashIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { convert } from "html-to-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlannerEventInviteeResponseStatus,
  usePlannerEventById,
} from "@/hooks/useEvents";
import { AddInviteeForm } from "@/components/AddInviteeForm";
import { Button } from "@/components/ui/button";
import { useRemoveInvitee } from "@/hooks/useCreateEvent";
import { InviteeStatusBadge } from "@/components/InviteeStatusBadge";
import { useParams, useRouter } from "next/navigation";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";

export default function Page() {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();
  const invitationRef = useRef<HTMLDivElement>(null);

  const { data: plannerEvent, isLoading, error } = usePlannerEventById(eventId);

  const removeInviteeMutation = useRemoveInvitee();
  const deleteEventMutation = useDeleteEvent();

  const handleRemoveInvitee = (inviteeId: string) => {
    removeInviteeMutation.mutate({ eventId, inviteeId });
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEventMutation.mutateAsync(eventId);
    router.push("/planner");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  if (!plannerEvent) {
    return <div>No event found</div>;
  }

  const dateText = isSameDay(plannerEvent.startDate, plannerEvent.endDate)
    ? format(new Date(plannerEvent.startDate), "PPpp")
    : `${new Date(plannerEvent.startDate).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} - ${new Date(plannerEvent.endDate).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`;

  const invitationText = invitationRef.current
    ? convert(invitationRef.current.innerHTML, {
        formatters: {
          title: function (elem, walk, builder, formatOptions) {
            builder.addLiteral("\n");
            walk(elem.children, builder);
            builder.addLiteral("\n---------------------------\n");
          },
        },
        wordwrap: 130,
        selectors: [
          {
            selector: "h3",
            format: "title",
          },
          {
            selector: "table",
            format: "dataTable",
          },
        ],
      })
    : "";

  console.log("Invitation text:", invitationText);

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold my-4">{plannerEvent.title}</h1>
      <h1 className="text-2xl mb-4">Gastenlijst</h1>
      <div className="flex flex-row gap-6 my-4">
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge
            status={PlannerEventInviteeResponseStatus.ACCEPTED}
          />
          <span>
            {
              plannerEvent.invitees.filter(
                (invitee) =>
                  invitee.status === PlannerEventInviteeResponseStatus.ACCEPTED
              ).length
            }
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge
            status={PlannerEventInviteeResponseStatus.DECLINED}
          />
          <span>
            {
              plannerEvent.invitees.filter(
                (invitee) =>
                  invitee.status === PlannerEventInviteeResponseStatus.DECLINED
              ).length
            }
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge
            status={PlannerEventInviteeResponseStatus.MAYBE}
          />
          <span>
            {
              plannerEvent.invitees.filter(
                (invitee) =>
                  invitee.status === PlannerEventInviteeResponseStatus.MAYBE
              ).length
            }
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge
            status={PlannerEventInviteeResponseStatus.PENDING}
          />
          <span>
            {
              plannerEvent.invitees.filter(
                (invitee) =>
                  invitee.status === PlannerEventInviteeResponseStatus.PENDING
              ).length
            }
          </span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Gastenlijst</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>E-mailadres</TableHead>
            <TableHead>Telefoonnummer</TableHead>
            <TableHead>Opmerkingen</TableHead>
            <TableHead>Gereageerd op</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plannerEvent.invitees.map((invitee) => (
            <TableRow key={invitee.id}>
              <TableCell className="font-medium">
                {invitee.firstName} {invitee.lastName}
              </TableCell>
              <TableCell>
                <InviteeStatusBadge status={invitee.status} />
              </TableCell>
              <TableCell>{invitee.email}</TableCell>
              <TableCell>{invitee.phoneNumber}</TableCell>
              <TableCell>{invitee.comments}</TableCell>
              <TableCell>
                {invitee.respondedAt
                  ? new Date(invitee.respondedAt).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleRemoveInvitee(invitee.id)}
                >
                  <TrashIcon className="text-red-700" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Gast toevoegen</h1>

      <AddInviteeForm eventId={plannerEvent.id} />

      <hr className="my-10" />
      <h1 className="text-2xl mb-4">De uitnodiging</h1>
      <div ref={invitationRef} className="p-4 border rounded">
        <h3>{plannerEvent.title}</h3>
        <div
          dangerouslySetInnerHTML={{ __html: plannerEvent.invitationText }}
        />
        <table>
          <tbody>
            <tr>
              <td className="w-32">🕙 Wanneer?</td>
              <td>{dateText}</td>
            </tr>
            <tr>
              <td className="w-32">📍 Waar?</td>
              <td>{plannerEvent.location}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Deel deze uitnodiging</h1>
      <div className="flex gap-2 mt-4">
        <TelegramShareButton
          url={`https://jouwfeestjeplannen.nl/rsvp/${plannerEvent.id}`}
          title={invitationText}
        >
          <TelegramIcon />
        </TelegramShareButton>
      </div>
      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Gevarenzone</h1>
      <div>
        <p>Hieronder kun je het evenement verwijderen.</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Dit kan niet ongedaan worden gemaakt.
        </p>
        <Button
          variant="destructive"
          onClick={() => handleDeleteEvent(plannerEvent.id)}
        >
          Verwijder evenement
        </Button>
      </div>
    </div>
  );
}
