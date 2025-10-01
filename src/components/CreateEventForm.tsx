"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  organiser: z.string().min(2, {
    message: "Organiser must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

const client = generateClient<Schema>();

export function CreateEventForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Mijn partijtje",
      organiser: "",
      description: "Test",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await client.models.Event.create(
      {
        title: values.title,
        organiser: values.organiser,
        description: values.description,
        eventId: values.title.toLowerCase().replaceAll(/[^a-zA-Z]/gi, ""),
      },
      {
        authMode: "userPool",
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Titel..." {...field} />
              </FormControl>
              <FormDescription>
                Dit is de naam die anderen zullen zien bij het evenement.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organiser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisator</FormLabel>
              <FormControl>
                <Input placeholder="Organisator..." {...field} />
              </FormControl>
              <FormDescription>
                Deze naam zullen mensen zien als organisator van het event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschrijving</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Een uitgebreidere beschrijving van jouw evenement. Een soort
                uitnodigingstekst.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Evenement aanmaken</Button>
      </form>
    </Form>
  );
}
