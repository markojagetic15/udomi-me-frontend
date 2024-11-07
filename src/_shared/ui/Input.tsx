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
    <div className='relative w-full'>
      <InputComponent
        id={name}
        name={name}
        type={type}
        hidden={hide}
        {...props}
        className='p-1.5'
        {...register}
        onChange={onChange}
        label={label}
        multiple={multiple}
        value={value}
        endContent={endIcon}
        startContent={startIcon}
      />

      {error && (
        <span className='text-danger text-xs absolute top-[92.5%] left-2'>
          {error}
        </span>
      )}
    </div>
  );
};
