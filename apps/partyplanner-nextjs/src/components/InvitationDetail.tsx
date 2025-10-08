import { PlannerEvent } from "@/types/events";
import { Invitation } from "@/types/invitations";
import { InviteeStatusBadge } from "./InviteeStatusBadge";
import { InviteeResponseStatus } from "@/types/invitees";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddInviteeForm } from "@/components/AddInviteeForm";
import { Button } from "@/components/ui/button";
import { useRemoveInvitee } from "@/hooks/useCreateEvent";
import { TrashIcon } from "lucide-react";
import { useRef } from "react";
import { format } from "date-fns/format";
import { convert } from "html-to-text";
import { TelegramIcon, TelegramShareButton } from "react-share";

export function InvitationDetails({
  invitation,
  plannerEvent,
}: {
  invitation: Invitation;
  plannerEvent: PlannerEvent;
}) {
  const invitationRef = useRef<HTMLDivElement>(null);

  const removeInviteeMutation = useRemoveInvitee();

  const handleRemoveInvitee = (inviteeId: string) => {
    removeInviteeMutation.mutate({ invitationId: invitation.id, inviteeId });
  };

  const dateText = format(new Date(invitation.startDate), "PPpp");

  const invitationText = invitationRef.current
    ? convert(invitationRef.current.innerHTML, {
        formatters: {
          title: function (elem, walk, builder) {
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

  return (
    <div className="mx-auto">
      <h1 className="text-2xl mb-4">Gastenlijst</h1>
      <div className="flex flex-row gap-6 my-4">
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge status={InviteeResponseStatus.ACCEPTED} />
          <span>
            {
              invitation.invitees.filter(
                (invitee) => invitee.status === InviteeResponseStatus.ACCEPTED
              ).length
            }
          </span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <InviteeStatusBadge status={InviteeResponseStatus.DECLINED} />
          <span>
            {
              invitation.invitees.filter(
                (invitee) => invitee.status === InviteeResponseStatus.DECLINED
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
                (invitee) => invitee.status === InviteeResponseStatus.PENDING
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
          {invitation.invitees.map((invitee) => (
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

      <AddInviteeForm invitationId={invitation.id} />

      <hr className="my-10" />
      <h1 className="text-2xl mb-4">De uitnodiging</h1>
      <div ref={invitationRef} className="p-4 border rounded">
        <h3>{plannerEvent.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: invitation.message }} />
        <table>
          <tbody>
            <tr>
              <td className="w-32">🕙 Wanneer?</td>
              <td>{dateText}</td>
            </tr>
            <tr>
              <td className="w-32">📍 Waar?</td>
              <td>{invitation.location}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Deel deze uitnodiging</h1>
      <div className="flex gap-2 mt-4">
        <TelegramShareButton
          url={`https://jouwfeestjeplannen.nl/rsvp/${invitation.code}`}
          title={invitationText}
        >
          <TelegramIcon />
        </TelegramShareButton>
      </div>
    </div>
  );
}
