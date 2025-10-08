"use client";

import { usePlannerEventById } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { InvitationsList } from "@/components/InvitationsList";
import { CreateInvitationForm } from "@/components/CreateInvitationForm";

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
    <div className="mx-auto">
      <h1 className="text-3xl font-bold my-4">{plannerEvent.title}</h1>
      <hr className="my-10" />
      <h1 className="text-2xl mb-4">Uitnodigingen</h1>
      <InvitationsList plannerEvent={plannerEvent} />
      <CreateInvitationForm eventId={plannerEvent.id} />
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
