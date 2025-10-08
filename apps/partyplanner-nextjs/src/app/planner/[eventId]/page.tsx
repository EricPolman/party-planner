"use client";

import { usePlannerEventById } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { InvitationsList } from "@/components/InvitationsList";
import { CreateInvitationForm } from "@/components/CreateInvitationForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();

  const { data: plannerEvent, isLoading, error } = usePlannerEventById(eventId);

  const deleteEventMutation = useDeleteEvent();

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEventMutation.mutateAsync(eventId);
    router.push("/planner");
    deleteEventMutation;
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

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-3xl font-bold my-4">{plannerEvent.title}</h1>
      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Uitnodigingen</h1>
      <InvitationsList plannerEvent={plannerEvent} />
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ Nieuwe uitnodiging aanmaken</Button>
        </DialogTrigger>
        <DialogContent>
          <CreateInvitationForm eventId={plannerEvent.id} />
        </DialogContent>
      </Dialog>
      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Gevarenzone</h1>
      <div>
        <p>Hieronder kun je het evenement verwijderen.</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Dit kan niet ongedaan worden gemaakt.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Verwijder evenement</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <p>
                Weet je zeker dat je dit evenement wilt verwijderen? Dit kan
                niet ongedaan worden gemaakt.
              </p>
              <div className="flex justify-end space-x-2">
                <DialogClose>
                  <Button variant="outline" onClick={() => router.back()}>
                    Annuleren
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(plannerEvent.id)}
                >
                  Verwijderen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
