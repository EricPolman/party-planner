import { PlannerEvent } from "@/types/events";
import { Invitation } from "@/types/invitations";
import { InviteeStatusBadge } from "./InviteeStatusBadge";
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
import { QrCodeIcon, TrashIcon } from "lucide-react";
import { useRef } from "react";
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
import { Switch } from "./ui/switch";
import { useToggleInvitationActive } from "@/hooks/useInvitations";

export function InvitationDetails({ invitation }: { invitation: Invitation }) {
  const invitationRef = useRef<HTMLDivElement>(null);

  const removeInviteeMutation = useRemoveInvitee();
  const toggleInvitationActiveMutation = useToggleInvitationActive();

  const handleRemoveInvitee = (inviteeId: string) => {
    removeInviteeMutation.mutate({ invitationId: invitation.id, inviteeId });
  };

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

  const rsvpUrl = `${window.location.origin}/rsvp/${invitation.code}`;

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
      <div className="md:flex md:flex-row gap-2 md:my-4 space-y-3 mt-4 mb-8">
        <WhatsappShareButton url={rsvpUrl} title={invitationText}>
          <WhatsappIcon className="rounded w-8 h-8" />
        </WhatsappShareButton>
        <TelegramShareButton url={rsvpUrl} title={invitationText}>
          <TelegramIcon className="rounded w-8 h-8" />
        </TelegramShareButton>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <QrCodeIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${rsvpUrl}`}
                alt="QR Code"
              />
            </div>
          </DialogContent>
        </Dialog>
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
        <div className="flex items-center gap-2">
          <Switch
            checked={invitation.isActive}
            onCheckedChange={(checked) =>
              toggleInvitationActiveMutation.mutate({
                eventId: invitation.id,
                isActive: checked,
              })
            }
          />{" "}
          Aanmeldingen accepteren
        </div>
      </div>
    </div>
  );
}
