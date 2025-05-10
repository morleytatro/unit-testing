import { useId } from 'react';
import { useFormContext } from '../hooks/form-context';

export function Input(
  props: React.ComponentProps<'input'> & {
    name: string;
    label: string;
  }
) {
  const calculatedId = useId();
  const { setValue, errors } = useFormContext();

  const id = props.id ?? calculatedId;

  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
          setValue(props.name, e.target.value);
        }}
      />
      {errors[props.name] && <p role="alert">{errors[props.name]}</p>}
    </div>
  );
}
