import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Textarea } from './ui/textarea'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRsvpReply } from '@/hooks/useRsvp'
import { InviteeResponseStatus } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

interface RsvpFormValues {
  email?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  status: InviteeResponseStatus;
  comments?: string;
}

const rsvpSchema = z.object({
  email: z.email(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phoneNumber: z.string().min(10).optional(),
  status: z.enum([
    InviteeResponseStatus.ACCEPTED,
    InviteeResponseStatus.DECLINED,
    InviteeResponseStatus.MAYBE,
  ]),
  comments: z.string().max(500).optional(),
});

export function EditInviteeForm({
  eventId,
}: {
  eventId: string;
  inviteeReply: RsvpFormValues;
}) {
  const rsvpMutation = useRsvpReply();

  const initialValues: RsvpFormValues = {
    email: "",
    firstName: "",
    lastName: "",
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
        const { email, firstName, lastName, phoneNumber } = value;
        await rsvpMutation.mutateAsync({
          eventId,
          email,
          firstName,
          lastName,
          phoneNumber,
          status: value.status,
          comments: value.comments,
        });
      },
    })
  );

  return (
    <div className="max-w-lg mx-auto">
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
                    <Button
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
                    </Button>
                    <Button
                      type="button"
                      className={cn("bg-yellow-500 hover:bg-yellow-600", {
                        "opacity-50":
                          field.state.value !== InviteeResponseStatus.MAYBE,
                      })}
                      onClick={() =>
                        field.handleChange(InviteeResponseStatus.MAYBE)
                      }
                    >
                      Misschien
                    </Button>
                    <Button
                      type="button"
                      className={cn("bg-red-500 hover:bg-red-600", {
                        "opacity-50":
                          field.state.value !== InviteeResponseStatus.DECLINED,
                      })}
                      onClick={() =>
                        field.handleChange(InviteeResponseStatus.DECLINED)
                      }
                    >
                      Afwezig
                    </Button>
                  </div>
                </Field>
              )}
            />
            <div className="flex flex-row gap-4">
              <form.Field
                name="firstName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="firstName">Voornaam</FieldLabel>
                    <Input
                      autoComplete="given-name"
                      placeholder="Voornaam"
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
                name="lastName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="lastName">Achternaam</FieldLabel>
                    <Input
                      autoComplete="family-name"
                      placeholder="Achternaam"
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
                <Button type="submit" className="mt-8" disabled={!canSubmit}>
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
