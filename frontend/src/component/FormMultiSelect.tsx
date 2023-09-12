import { FormControl, InputLabel, Select, SelectProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * usage note:
 * Please see Form.tsx
 */

type Props = SelectProps & {
  name: string;
};

const FormSelect = ({ name, required = false, defaultValue, children, label, ...props }: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? ''}
      rules={{ required }}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            required={required}
            value={value.split(',')}
            multiple
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = typeof value === 'string' ? value : value.join(',');
              onChange(e);
            }}
            {...rest}
            {...props}
            error={!!errors[name]}
          >
            {children}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default FormSelect;
