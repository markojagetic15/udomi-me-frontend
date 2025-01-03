import {
  AutocompleteItem,
  Autocomplete as AutocompleteComponent,
} from '@nextui-org/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export const Autocomplete = ({
  label,
  items,
  register,
  className,
}: {
  label: string;
  items: {
    key: string;
    label: string;
  }[];
  register?: UseFormRegisterReturn<string>;
  className?: string;
}) => {
  return (
    <AutocompleteComponent
      className={className}
      label={label}
      {...register}
      autoComplete='new-password'
    >
      {items.map((code) => (
        <AutocompleteItem key={code.key}>{code.label}</AutocompleteItem>
      ))}
    </AutocompleteComponent>
  );
};
