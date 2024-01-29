import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'white' | 'indigo';
};

export default function Button({ color = 'indigo', className, ...props }: Props) {
  return (
    <button
      className={classNames('rounded-[4px] font-bold', className, {
        'bg-white': color === 'white',
        'bg-indigo-500 text-white': color === 'indigo',
      })}
      {...props}
    ></button>
  );
}
