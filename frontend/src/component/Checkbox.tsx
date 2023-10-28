import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = ({ label, disabled, ...props }: Props) => (
  <div className="flex w-fit items-center">
    <input
      className={`relative m-0 cursor-pointer appearance-none rounded-sm border border-solid border-grey-500 bg-white
        p-[7px] after:absolute after:left-[4px] after:top-[0px] after:h-[11px] after:w-[6px] after:rotate-45
        after:border-b-2 after:border-l-0 after:border-r-2 after:border-t-0 after:border-solid after:border-white
        checked:border-indigo-500 checked:bg-indigo-500 checked:content-['']`}
      id={label}
      disabled={disabled}
      {...props}
      type="checkbox"
    />
    {label && (
      <label htmlFor={label} className="cursor-pointer pl-[10px] text-[14px] leading-[1.5]">
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;
