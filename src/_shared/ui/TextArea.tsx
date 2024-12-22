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
}) => {
  return (
    <div className='flex flex-col gap-1.5 relative'>
      <div className={`relative w-full`}>
        <TextareaComponent
          id={name}
          name={name}
          type={type}
          hidden={hide}
          {...props}
          className={`border border-gray-300 rounded-md p-1.5 outline-none focus:border-green-500 w-full`}
          {...register}
          onChange={onChange}
          label={label}
          isRequired={isRequired}
        />
        {endIcon && (
          <div className='absolute right-2.5 top-1/2 flex justify-end -translate-x-1/2 -translate-y-1/2 cursor-pointer'>
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <span className='text-red-500 text-xs absolute top-[95%] left-2'>
          {error}
        </span>
      )}
    </div>
  );
};
