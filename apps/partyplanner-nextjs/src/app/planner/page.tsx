"use client";

import { AddEventOrganiserForm } from "@/components/AddEventOrganiserForm";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePlannerEvents } from "@/hooks/useEvents";
import { useState } from "react";

export default function PlannerPage() {
  const { data } = usePlannerEvents();
  const [eventToAddOrganiser, setEventToAddOrganiser] = useState<string | null>(null);

  return (
    <div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Jouw evenementen</h2>
        <p className="text-gray-600 mb-4">
          Hier vind je een overzicht van al jouw evenementen.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {data?.map((event) => (
          <a
            key={event.id}
            href={`/planner/${event.id}`}
            className="block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-1">{event.description}</p>
            <p className="italic text-sm mb-1">Organisatoren: {event.organisers.map((org) => `${org.firstName} ${org.lastName}`).join(", ")}
            </p>
            <Dialog open={eventToAddOrganiser === event.id} onOpenChange={(open) => !open && setEventToAddOrganiser(null)}>
              <Button variant="link" size="sm" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEventToAddOrganiser(event.id)
              }}>+ Organisator toevoegen</Button>
              <DialogContent>
                <AddEventOrganiserForm eventId={event.id} onClose={() => setEventToAddOrganiser(null)} />
              </DialogContent>
            </Dialog>
          </a>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">+ Nieuw evenement</h2>
              <p className="text-gray-600 mb-1">
                Start met het plannen van een nieuw evenement
              </p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <CreateEventForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-2">Hoe het werkt</h2>
        <p className="text-gray-600 mb-4 max-w-md">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Maak een evenement aan en geef deze een titel en beschrijving.
              Deze worden niet getoond in de uitnodiging.
            </li>
            <li>
              Stel een uitnodiging op met een tekst die je via bijvoorbeeld
              WhatsApp kunt delen.{" "}
            </li>
            <li>
              Verstuur deze uitnodiging naar jouw gasten en laat ze hun
              beschikbaarheid doorgeven.
            </li>
          </ol>
        </p>
      </div>
    </div>
  );
}
