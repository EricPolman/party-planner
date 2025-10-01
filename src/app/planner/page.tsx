"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import { User } from "@/components/User";
import { CreateEventForm } from "@/components/CreateEventForm";
import { useEvents } from "@/hooks/useEvents";

Amplify.configure(outputs);

export default function Home() {
  const { data: events } = useEvents();

  return (
    <Authenticator>
      <User />
      <CreateEventForm />
      {events?.data.map((e) => e.eventId).join(", ")}
    </Authenticator>
  );
}
