"use client";

import { useRef } from "react";
import { TelegramIcon, TelegramShareButton } from "react-share";
import { PencilIcon, TrashIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const handleRemoveInvitee = (inviteeId: number) => {
    removeInviteeMutation.mutate({ eventId: +eventId, inviteeId });
  };

  const handleDeleteEvent = async (eventId: number) => {
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

  return (
    <div className="mx-auto">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" size="icon" variant="outline">
                      <PencilIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
        <strong>{plannerEvent.title}</strong>
        <p>{plannerEvent.invitationText}</p>
        <br />
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
      <div className="flex gap-2 mt-4">
        <TelegramShareButton
          url={window.location.href}
          title={invitationRef.current?.innerHTML || ""}
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
