import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { TiptapEditor } from './ui/editor'
import { DateTimePicker } from './ui/datetime-picker'
import { useCreateEvent } from '@/hooks/useCreateEvent'

interface CreateEventFormValues {
  title: string
  invitationText: string
  startDate: Date | undefined
  endDate: Date | undefined
  location: string
}

const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  invitationText: z.string().max(500),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(2).max(100),
})

export function CreateEventForm() {
  const navigate = useNavigate()

  const createEventMutation = useCreateEvent()

  const initialValues: CreateEventFormValues = {
    title: 'Mijn verjaardagsfeestje',
    invitationText: 'Kom naar mijn partijtje',
    startDate: new Date(),
    endDate: new Date(),
    location: 'Thuis',
  }

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: createEventSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        if (!value.startDate || !value.endDate) {
          return
        }

        const { title, invitationText, startDate, endDate, location } = value
        await createEventMutation.mutateAsync({
          title,
          invitationText,
          startDate,
          endDate,
          location,
        })

        formApi.reset()

        const id = createEventMutation.data?.id
        if (id) {
          navigate({ to: `/planner/${id}`, params: { eventId: `${id}` } })
        }
      },
    }),
  )

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
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
            name="invitationText"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="invitationText">
                  Uitnodigingstekst
                </FieldLabel>
                <TiptapEditor
                  content={field.state.value}
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
              {isSubmitting && '...'} Evenement aanmaken
            </Button>
          )}
        />
      </form>
    </div>
  )
}
