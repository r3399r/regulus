import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * usage note:
 * Please see Form.tsx
 */

type Props = CheckboxProps & {
  name: string;
  label?: string;
};

const FormCheckbox = ({ name, label, required = false, defaultChecked, ...props }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultChecked ?? false}
      rules={{ required }}
      render={({ field }) => (
        <FormControlLabel control={<Checkbox {...props} />} label={label} {...field} />
      )}
    />
  );
};

export default FormCheckbox;
