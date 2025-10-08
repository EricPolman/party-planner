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
import {
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { InvitationCard } from "./InvitationCard";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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
    <div>
      <h1 className="text-lg mb-4">Gastenlijst</h1>
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="my-4">+ Gast toevoegen</Button>
        </DialogTrigger>
        <DialogContent>
          <AddInviteeForm invitationId={invitation.id} />
        </DialogContent>
      </Dialog>

      <hr className="my-5" />
      <h1 className="text-lg mb-4">De uitnodiging</h1>
      <div ref={invitationRef}>
        <InvitationCard invitation={invitation} />
      </div>
      <div className="flex gap-2 my-4">
        <WhatsappShareButton
          url={`${window.location.origin}/rsvp/${invitation.code}`}
          title={invitationText}
        >
          <WhatsappIcon className="rounded w-8 h-8" />
        </WhatsappShareButton>
        <TelegramShareButton
          url={`${window.location.origin}/rsvp/${invitation.code}`}
          title={invitationText}
        >
          <TelegramIcon className="rounded w-8 h-8" />
        </TelegramShareButton>
        <Link
          href={`/rsvp/${invitation.code}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline">Bekijk uitnodiging</Button>
        </Link>
        <Button
          variant="outline"
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/rsvp/${invitation.code}`
            )
          }
        >
          Kopieer link
        </Button>
      </div>
    </div>
  );
}
