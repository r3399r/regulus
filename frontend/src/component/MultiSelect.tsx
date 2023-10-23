import { FormControl, InputLabel, Select, SelectProps } from '@mui/material';
import { useState } from 'react';

type Props = SelectProps & {
  defaultValue?: string[];
};

const MultiSelect = ({ children, defaultValue, label, ...props }: Props) => {
  const [value, setValue] = useState<string[]>(defaultValue ?? []);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        multiple
        onChange={(e) => {
          setValue(e.target.value as string[]);
        }}
        {...props}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
