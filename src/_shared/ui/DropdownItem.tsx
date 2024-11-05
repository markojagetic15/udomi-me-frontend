import { DropdownItem as DropdownItemComponent } from '@nextui-org/react';

export const DropdownItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <DropdownItemComponent
      className={`group relative flex h-[30px] select-none items-center rounded-[3px] pl-[10px] pr-[5px] pt-[20px] pb-[20px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 hover:bg-cream cursor-pointer hover:text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </DropdownItemComponent>
  );
};
