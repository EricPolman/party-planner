"use client";

import { z } from "zod";
import { formOptions, useForm } from "@tanstack/react-form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TiptapEditor } from "./ui/editor";
import { DateTimePicker } from "./ui/datetime-picker";
import { useCreateInvitation } from "@/hooks/useCreateEvent";
import Markdown from "react-markdown";
import { MarkdownEditor } from "./ui/markdown-editor";

interface CreateEventFormValues {
  title: string;
  message: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  location: string;
}

const createEventSchema = z.object({
  message: z.string().max(500),
  title: z.string().max(100),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(2).max(100),
});

export function CreateInvitationForm({ eventId }: { eventId: string }) {
  const createInvitation = useCreateInvitation();

  const initialValues: CreateEventFormValues = {
    title: "Mijn verjaardagsfeestje",
    message: "Kom naar mijn partijtje",
    startDate: new Date(),
    endDate: new Date(),
    location: "Thuis",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: createEventSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        if (!value.startDate || !value.endDate) {
          return;
        }

        const { title, message, startDate, endDate, location } = value;
        await createInvitation.mutateAsync({
          eventId,
          title,
          message: message.replaceAll("\n", "\n\n"),
          startDate,
          endDate,
          location,
        });

        formApi.reset();
      },
    })
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-6">
          <form.Field
            name="title"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="title">Titel</FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Titel van de uitnodiging"
                  value={field.state.value}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
          <form.Field
            name="message"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="message">Uitnodigingstekst</FieldLabel>
                <MarkdownEditor
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              </Field>
            )}
          />

          <form.Field
            name="startDate"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Startdatum en tijd</FieldLabel>
                <DateTimePicker
                  placeholder="Begin van het evenement"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e)}
                />
              </Field>
            )}
          />
          <form.Field
            name="endDate"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Einddatum en tijd</FieldLabel>
                <DateTimePicker
                  placeholder="Einde van het evenement"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e)}
                />
              </Field>
            )}
          />
          <form.Field
            name="location"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="location">Locatie</FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Locatie van het evenement"
                  value={field.state.value}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="mt-8" disabled={!canSubmit}>
              {isSubmitting && "..."} Uitnodiging aanmaken
            </Button>
          )}
        />
      </form>
    </div>
  );
}
