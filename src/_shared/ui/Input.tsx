import { Input as InputComponent } from '@nextui-org/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export const Input = ({
  name,
  label,
  type = 'text',
  error,
  register,
  endIcon,
  startIcon,
  hide,
  onChange,
  multiple,
  value,
  ...props
}: {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn<string>;
  hide?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  value?: string;
}) => {
  return (
    <div className='flex flex-col gap-1.5 relative'>
      <div className=''>
        <InputComponent
          id={name}
          name={name}
          type={type}
          hidden={hide}
          {...props}
          className='border border-accent rounded-md p-1.5 outline-none focus:border-green-500 w-full'
          {...register}
          onChange={onChange}
          label={label}
          multiple={multiple}
          value={value}
          endContent={endIcon}
          startContent={startIcon}
        />
      </div>

      {error && (
        <span className='text-danger text-xs absolute top-[95%] left-2'>
          {error}
        </span>
      )}
    </div>
  );
};
