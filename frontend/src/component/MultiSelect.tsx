import { FormControl, InputLabel, Select, SelectProps } from '@mui/material';

type Props = SelectProps & {
  value?: string[];
};

const MultiSelect = ({ children, onChange, value, label, ...props }: Props) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select label={label} value={value} multiple onChange={onChange} {...props}>
      {children}
    </Select>
  </FormControl>
);
export default MultiSelect;
