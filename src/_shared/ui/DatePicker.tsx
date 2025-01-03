import { DatePicker as DatePickerComponent } from '@nextui-org/date-picker';
import { DateValue } from '@nextui-org/react';

export const DatePicker = ({
  error,
  label,
  maxValue,
  description,
  onChange,
}: {
  error?: string;
  label?: string;
  maxValue?: DateValue;
  description?: string;
  onChange: (date: DateValue) => void;
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
    <div className='relative w-full '>
      <DatePickerComponent
        label={label}
        maxValue={maxValue}
        isInvalid={!!error}
        onChange={onChange}
      />

      <div className='absolute top-[97.5%] left-0'>
        {renderErrorAndDescription()}
      </div>
    </div>
  );
};
