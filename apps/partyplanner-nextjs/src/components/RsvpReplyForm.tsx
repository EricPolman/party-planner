"use client";

import { z } from "zod";
import { formOptions, useForm } from "@tanstack/react-form";
import { Textarea } from "./ui/textarea";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRsvpReply } from "@/hooks/useRsvp";
import { cn } from "@/lib/utils";
import { InviteeResponseStatus } from "@/types/invitees";
import { PulseButton } from "./ui/pulse-button";

interface RsvpFormValues {
  email?: string;
  name: string;
  phoneNumber?: string;
  status: InviteeResponseStatus;
  comments?: string;
}

const rsvpSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  phoneNumber: z.string().min(10).optional(),
  status: z.enum([
    InviteeResponseStatus.ACCEPTED,
    InviteeResponseStatus.DECLINED,
    InviteeResponseStatus.MAYBE,
  ]),
  comments: z.string().max(500).optional(),
});

export function RsvpForm({ invitationCode }: { invitationCode: string }) {
  const rsvpMutation = useRsvpReply();

  const initialValues: RsvpFormValues = {
    email: "",
    name: "",
    phoneNumber: "",
    status: InviteeResponseStatus.ACCEPTED,
    comments: "",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: rsvpSchema,
      },
      onSubmit: async ({ value }) => {
        const { email, name, phoneNumber } = value;
        await rsvpMutation.mutateAsync({
          invitationCode,
          email,
          name,
          phoneNumber,
          status: value.status,
          comments: value.comments,
        });
      },
    })
  );

  return (
    <div className="max-w-lg mx-auto px-4 pb-10">
      {rsvpMutation.isSuccess ? (
        <div className="p-4 bg-green-100 text-green-800 rounded space-y-4">
          <h2 className="text-lg font-medium mb-2">Bedankt voor je reactie!</h2>
          <p>We hebben je RSVP ontvangen.</p>
          <Button type="button" onClick={() => rsvpMutation.reset()}>
            Aanwezigheid aanpassen
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col space-y-6">
            <form.Field
              name="status"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="status">Aanwezig?</FieldLabel>
                  <div className="space-x-4 grid grid-cols-3">
                    <PulseButton
                      size="lg"
                      color="bg-green-500"
                      type="button"
                      className={cn("bg-green-500 hover:bg-green-600", {
                        "opacity-50":
                          field.state.value !== InviteeResponseStatus.ACCEPTED,
                      })}
                      onClick={() =>
                        field.handleChange(InviteeResponseStatus.ACCEPTED)
                      }
                    >
                      Aanwezig
                    </PulseButton>
                    <PulseButton
                      size="lg"
                      type="button"
                      color="bg-yellow-500"
                      className={cn("bg-yellow-500 hover:bg-yellow-600", {
                        "opacity-50":
                          field.state.value !== InviteeResponseStatus.MAYBE,
                      })}
                      onClick={() =>
                        field.handleChange(InviteeResponseStatus.MAYBE)
                      }
                    >
                      Misschien
                    </PulseButton>
                    <PulseButton
                      size="lg"
                      type="button"
                      color="bg-red-500"
                      className={cn("bg-red-500 hover:bg-red-600", {
                        "opacity-50":
                          field.state.value !== InviteeResponseStatus.DECLINED,
                      })}
                      onClick={() =>
                        field.handleChange(InviteeResponseStatus.DECLINED)
                      }
                    >
                      Afwezig
                    </PulseButton>
                  </div>
                </Field>
              )}
            />
            <div className="flex flex-row gap-4">
              <form.Field
                name="name"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Naam</FieldLabel>
                    <Input
                      autoComplete="name"
                      placeholder="Naam"
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
            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="email">E-mailadres</FieldLabel>
                  <Input
                    autoComplete="email"
                    placeholder="E-mailadres"
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
              name="phoneNumber"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="phoneNumber">Telefoonnummer</FieldLabel>
                  <Input
                    autoComplete="tel"
                    placeholder="Telefoonnummer"
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
              name="comments"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="comments">Opmerkingen</FieldLabel>
                  <Textarea
                    autoComplete="off"
                    placeholder="Opmerkingen"
                    value={field.state.value}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="mt-8"
                  disabled={!canSubmit}
                  size="lg"
                >
                  {isSubmitting && "..."} Aanwezigheid doorgeven
                </Button>
              )}
            />
          </div>
        </form>
      )}
    </div>
  );
}
