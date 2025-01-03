import React, { Key, ReactNode } from 'react';
import {
  Dropdown as DropdownComponent,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

interface DropdownProps {
  trigger: React.ReactNode;
  items: {
    key: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  }[];
  onAction?: (key: Key) => void;
  selectedKeys?: Key[];
}

export const Dropdown = ({
  trigger,
  items,
  onAction,
  selectedKeys,
}: DropdownProps) => {
  return (
    <DropdownComponent>
      <DropdownTrigger className='cursor-pointer'>{trigger}</DropdownTrigger>
      <DropdownMenu
        onAction={onAction}
        selectedKeys={selectedKeys as any}
        selectionMode='multiple'
      >
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            startContent={item.icon}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownComponent>
  );
};
