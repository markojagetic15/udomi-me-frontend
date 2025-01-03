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
  width,
  isRequired,
  description,
  className,
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
  width?: string;
  isRequired?: boolean;
  description?: string;
  className?: string;
}) => {
  const renderErrorAndDescription = () => {
    if (error) {
      return <span className='text-red-500 text-xs'>{error}</span>;
    }

    if (description) {
      return <span className='text-gray-400 text-xs'>{description}</span>;
    }

    return null;
  };

  return (
    <div className={`relative w-full ${className}`}>
      <InputComponent
        id={name}
        name={name}
        type={type}
        hidden={hide}
        {...props}
        className={`${width ? width : 'w-full'}`}
        {...register}
        onChange={onChange}
        label={label}
        multiple={multiple}
        value={value}
        endContent={endIcon}
        startContent={startIcon}
        isRequired={isRequired}
        isInvalid={!!error}
        autoComplete='new-password'
      />

      <div className='absolute top-[97.5%] left-0'>
        {renderErrorAndDescription()}
      </div>
    </div>
  );
};
