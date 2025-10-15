import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAddEventOrganiser } from '@/hooks/useCreateEvent'

interface AddEventOrganiserFormValues {
  email: string
}

const addEventOrganiserSchema = z.object({
  email: z.string().min(2),
})

export function AddEventOrganiserForm({
  eventId,
  onClose,
}: {
  eventId: string;
  onClose: () => void;
}) {
  const addEventOrganiserMutation = useAddEventOrganiser();

  const initialValues: AddEventOrganiserFormValues = {
    email: "",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: addEventOrganiserSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        const { email } = value;

        await addEventOrganiserMutation.mutateAsync({
          eventId,
          email,
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
            name="email"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>E-mailadres</FieldLabel>
                <Input
                  type="email"
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  placeholder="jan@voorbeeld.nl"
                  value={field.state.value}
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
                {isSubmitting && "..."} Toevoegen
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
