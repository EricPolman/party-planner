import { z } from 'zod'
import { formOptions, useForm } from '@tanstack/react-form'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAddInvitees } from '@/hooks/useCreateEvent'
import { Textarea } from './ui/textarea'

interface AddInviteesFormValues {
  names: string
}

const addInviteesSchema = z.object({
  names: z.string().min(2),
})

export function AddInviteesForm({
  invitationId,
  onClose,
}: {
  invitationId: string;
  onClose: () => void;
}) {
  const addInviteesMutation = useAddInvitees();

  const initialValues: AddInviteesFormValues = {
    names: "",
  };

  const form = useForm(
    formOptions({
      defaultValues: initialValues,
      validators: {
        onChange: addInviteesSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        const { names } = value;
        // clean up names input by removing extra spaces and empty lines
        const cleanedNames = names
          .split("\n")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);
        const namesString = cleanedNames.join(",");

        if (cleanedNames.length === 0) {
          return;
        }

        console.log("Adding invitees:", namesString);

        await addInviteesMutation.mutateAsync({
          invitationId,
          names: namesString,
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
            name="names"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="names">Namen</FieldLabel>
                <Textarea
                  autoComplete="off"
                  placeholder="Vul meerdere namen in, één per regel of gescheiden door een komma"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  id={field.name}
                  rows={10}
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
