"use client";

import { z } from "zod";
import { formOptions, useForm } from "@tanstack/react-form";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useRouter } from "next/navigation";

interface CreateEventFormValues {
  title: string;
  description: string;
}

const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500),
});

export function CreateEventForm() {
  const router = useRouter();

  const createEventMutation = useCreateEvent();

  const initialValues: CreateEventFormValues = {
    title: "Mijn verjaardagsfeestje",
    description:
      "Jouw beschrijving van het feestje, niet de uitnodigingstekst.",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: createEventSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        const { title, description } = value;
        const response = await createEventMutation.mutateAsync({
          title,
          description,
        });

        formApi.reset();

        if (response.id) {
          router.push(`/planner/${response.id}`);
        }
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
                  placeholder="Titel van het evenement"
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
            name="description"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="description">Beschrijving</FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Beschrijving van het evenement"
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
              {isSubmitting && "..."} Evenement aanmaken
            </Button>
          )}
        />
      </form>
    </div>
  );
}
