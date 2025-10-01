"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../../../amplify_outputs.json";

import type { Schema } from "../../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Page({
  params,
}: {
  params: Promise<Record<string, string>>;
}) {
  params.then((p) => console.log(p));

  const [eventEntity, setEventEntity] = useState<
    Schema["Event"]["type"] | null
  >(null);

  const fetchEvent = async () => {
    const { eventId } = await params;

    const { data: items } = await client.models.Event.list({
      filter: { eventId: { eq: eventId } },
      authMode: "userPool",
    });
    setEventEntity(items[0] ?? null);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return eventEntity ? (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <h1 className="text-xl">{eventEntity.title}</h1>
        <em className="text-sm">Georganiseerd door {eventEntity.organiser}</em>
        <p className="mt-3">{eventEntity.description}</p>
        <Input placeholder="Naam..." />
        <div className="flex flex-row gap-2">
          <Button className="bg-red-700">Afwezig</Button>
          <Button className="bg-amber-500">Misschien</Button>
          <Button className="bg-green-700">Aanwezig</Button>
        </div>
        <Input placeholder="Opmerkingen..." />
        <Button>Opslaan</Button>
      </main>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
