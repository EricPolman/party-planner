import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAddInvitee } from '@/hooks/useCreateEvent'

interface AddInviteeFormValues {
  email?: string
  firstName: string
  lastName?: string
  phoneNumber?: string
}

const addInviteeSchema = z.object({
  email: z.email(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phoneNumber: z.string().min(10).optional(),
})

export function AddInviteeForm({ eventId }: { eventId: number }) {
  const addInviteeMutation = useAddInvitee()

  const initialValues: AddInviteeFormValues = {
    email: 'example@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
  }

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: addInviteeSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        const { email, firstName, lastName, phoneNumber } = value
        await addInviteeMutation.mutateAsync({
          eventId,
          email,
          firstName,
          lastName,
          phoneNumber,
        })

        formApi.reset()
      },
    }),
  )

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-row gap-3">
          <form.Field
            name="firstName"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="firstName">Voornaam</FieldLabel>
                <Input
                  autoComplete="off"
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
                  autoComplete="off"
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
                {isSubmitting && '...'} Gast toevoegen
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
