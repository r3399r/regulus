import { ReactNode } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

/**
 * usage example:
 *
 * type Form = { a: string, b: string }
 * const methods = useForm<Form>({ defaultValues: { a: 'test' } });
 * const onSubmit = (data: Form) => { ... };
 *
 *
 * <Form methods={methods} onSubmit={onSubmit}>
 *   <FormInput name="a" />
 *   <FormSelect name="b">
 *     <SelectOption value="1">apple</SelectOption>
 *     <SelectOption value="2">banana</SelectOption>
 *   </FormSelect>
 *   <FormRadioGroup name="c">
 *     <Radio value="c1" label="C1"/>
 *     <Radio value="c2" label="C2"/>
 *   </FormRadioGroup>
 *   <FormDatetimePicker name="d"/>
 *   <FormAutoComplete name="e">
 *     <AutoCompleteOption value="apple">apple</AutoCompleteOption>
 *     <AutoCompleteOption value="banana">banana</AutoCompleteOption>
 *   </FormAutoComplete>
 *   <Button type="submit">Submit</Button>
 * </Form>
 */

type Props<T> = {
  methods: UseFormReturn<T extends FieldValues ? T : never>;
  onSubmit: SubmitHandler<T extends FieldValues ? T : never>;
  children: ReactNode;
  className?: string;
};

const Form = <T extends FieldValues>({ methods, onSubmit, children, className }: Props<T>) => (
  <FormProvider {...methods}>
    <form className={className} onSubmit={methods.handleSubmit(onSubmit)}>
      {children}
    </form>
  </FormProvider>
);

export default Form;
