import { Switch as SwitchComponent } from '@nextui-org/switch';
import { UseFormRegisterReturn } from 'react-hook-form';

export const Switch = ({
  defaultSelected,
  register,
  label,
  description,
}: {
  defaultSelected?: boolean;
  register?: UseFormRegisterReturn<string>;
  label: string;
  description?: string;
}) => {
  return (
    <SwitchComponent defaultSelected={defaultSelected} {...register} size='sm'>
      {label}
    </SwitchComponent>
  );
};
