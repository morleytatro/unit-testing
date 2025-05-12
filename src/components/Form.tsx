import { useState } from 'react';
import { FormContext } from '../hooks/form-context';
import type { ZodSchema } from 'zod';

/**
 * Features:
 * - Can set values in the form
 * - Can start with default values
 * - Can validate the form using a Zod schema
 * - Can submit the form
 * - Can reset the form
 */

type Props<TValues> = Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
  defaultValues: Record<string, unknown>;
  onSubmit: (values: TValues, reset: () => void) => void;
  schema: ZodSchema<TValues>;
  onInvalid?: (errors: unknown) => void;
};

export function Form<TValues>(props: Props<TValues>) {
  const { onSubmit } = props;
  const [values, setValues] = useState(props.defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitCount, setSubmitCount] = useState(0);

  function reset() {
    setValues(props.defaultValues);
    setErrors({});
    setSubmitCount(0);
  }

  function setValue(name: string, value: unknown) {
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);

    // if we've already submitted the form, validate the updated values
    if (submitCount > 0) {
      const parsed = props.schema.safeParse(updatedValues);
      if (!parsed.success) {
        const errorsObj = Object.fromEntries(
          parsed.error.errors.flatMap((error) =>
            error.path.map((path) => [path, error.message])
          )
        );
        setErrors(errorsObj);
      } else {
        setErrors({});
      }
    }
  }

  return (
    <FormContext.Provider
      value={{
        values,
        setValue,
        reset,
        errors,
        submitCount,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitCount((prev) => prev + 1);
          const parsed = props.schema.safeParse(values);

          if (parsed.success) {
            onSubmit(parsed.data, reset);
          } else {
            const errorsObj = Object.fromEntries(
              parsed.error.errors.flatMap((error) =>
                error.path.map((path) => [path, error.message])
              )
            );

            setErrors(errorsObj);
            props.onInvalid?.(parsed.error);
          }
        }}
      >
        {props.children}
      </form>
    </FormContext.Provider>
  );
}
