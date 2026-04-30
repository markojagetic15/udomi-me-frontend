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
  onChange,
  multiple,
  value,
  width,
  isRequired,
  description,
  className,
  id,
  hidden,
  placeholder,
  ...props
}: {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn<string>;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  value?: string;
  width?: string;
  isRequired?: boolean;
  description?: string;
  className?: string;
  id?: string;
  hidden?: boolean;
  maxLength?: number;
}) => {
  return (
    <div className={`${width ? `w-${width}` : 'w-full'} ${className ?? ''}`}>
      <InputComponent
        id={id}
        name={name}
        type={type}
        hidden={hidden}
        placeholder={placeholder}
        {...props}
        className={width ? `w-${width}` : 'w-full'}
        {...register}
        onChange={onChange}
        label={label}
        multiple={multiple}
        value={value}
        endContent={
          endIcon ? (
            <div className='flex items-center h-full'>{endIcon}</div>
          ) : undefined
        }
        startContent={
          startIcon ? (
            <div className='flex items-center h-full'>{startIcon}</div>
          ) : undefined
        }
        isRequired={isRequired}
        isInvalid={!!error}
        errorMessage={error}
        description={!error ? description : undefined}
        autoComplete='new-password'
      />
    </div>
  );
};
