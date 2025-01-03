import { Textarea as TextareaComponent } from '@nextui-org/input';
import { UseFormRegisterReturn } from 'react-hook-form';

export const TextArea = ({
  name,
  label,
  type = 'text',
  error,
  register,
  endIcon,
  hide,
  onChange,
  isRequired,
  description,
  ...props
}: {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn<string>;
  hide?: boolean;
  endIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  description?: string;
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
    <div className='flex flex-col gap-1.5 relative mb-2.5'>
      <div className={`relative w-full`}>
        <TextareaComponent
          id={name}
          name={name}
          type={type}
          hidden={hide}
          {...props}
          className={`border border-gray-300 rounded-md outline-none focus:border-green-500 w-full`}
          {...register}
          onChange={onChange}
          label={label}
          isRequired={isRequired}
          isInvalid={!!error}
        />
        {endIcon && (
          <div className='absolute right-2.5 top-1/2 flex justify-end -translate-x-1/2 -translate-y-1/2 cursor-pointer'>
            {endIcon}
          </div>
        )}
      </div>

      <div className='absolute top-[97.5%] left-0'>
        {renderErrorAndDescription()}
      </div>
    </div>
  );
};
