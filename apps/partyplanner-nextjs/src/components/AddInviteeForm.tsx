import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAddInvitee } from '@/hooks/useCreateEvent'

interface AddInviteeFormValues {
  email?: string
  name: string
  phoneNumber?: string
}

const addInviteeSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  phoneNumber: z.string().min(10).optional(),
})

export function AddInviteeForm({
  invitationId,
  onClose,
}: {
  invitationId: string;
  onClose: () => void;
}) {
  const addInviteeMutation = useAddInvitee();

  const initialValues: AddInviteeFormValues = {
    email: "",
    name: "",
    phoneNumber: "",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: addInviteeSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        const { email, name, phoneNumber } = value;
        await addInviteeMutation.mutateAsync({
          invitationId,
          email,
          name,
          phoneNumber,
        });

        formApi.reset();
        onClose();
      },
    })
  );

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-3">
          <form.Field
            name="name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="name">Naam</FieldLabel>
                <Input
                  autoComplete="off"
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
          <form.Field
            name="email"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="email">E-mailadres</FieldLabel>
                <Input
                  autoComplete="off"
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
                  autoComplete="off"
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
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" className="mt-8" disabled={!canSubmit}>
                {isSubmitting && "..."} Gasten toevoegen
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
