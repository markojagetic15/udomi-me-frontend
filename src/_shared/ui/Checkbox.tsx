import { Checkbox as CheckboxComponent } from '@nextui-org/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export const Checkbox = ({
  label,
  register,
  error,
  ...props
}: {
  label: string;
  register: UseFormRegisterReturn<string> | undefined;
  error: string | undefined;
}) => {
  return (
    <div className='flex gap-2 flex-col'>
      <div className='flex gap-6 w-full items-center'>
        <CheckboxComponent
          type='checkbox'
          className='rounded-md p-3 accent-green-500 w-4 h-4 cursor-pointer'
          {...register}
          {...props}
        />
        <label>{label}</label>
      </div>
      {error && <span className='text-red-500 text-xs'>{error}</span>}
    </div>
  );
};
