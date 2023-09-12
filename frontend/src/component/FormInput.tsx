import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * usage note:
 * Please see Form.tsx
 */

type Props = TextFieldProps & {
  name: string;
  minLength?: number;
  maxLength?: number;
};

const FormInput = ({
  name,
  required = false,
  minLength,
  maxLength,
  defaultValue,
  ...props
}: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      rules={{ required, minLength, maxLength }}
      render={({ field }) => (
        <TextField required={required} {...field} {...props} error={!!errors[name]} />
      )}
    />
  );
};

export default FormInput;
