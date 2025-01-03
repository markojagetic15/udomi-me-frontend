import { SelectItem, Select as SelectComponent } from '@nextui-org/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export const Select = ({
  register,
  error,
  items,
  label,
  description,
  width,
  isRequired,
}: {
  register?: UseFormRegisterReturn<string>;
  label: string;
  error?: string;
  items: {
    key: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  isRequired?: boolean;
  description?: string;
  width?: string;
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
    <div className={`relative ${width ? `w-${width}` : 'w-full'}`}>
      <SelectComponent
        label={label}
        className='max-w-xs'
        {...register}
        isInvalid={!!error}
        isRequired={isRequired}
      >
        {items.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </SelectComponent>

      <div className='absolute top-[97.5%] left-0'>
        {renderErrorAndDescription()}
      </div>
    </div>
  );
};
