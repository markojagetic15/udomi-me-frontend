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
}

export const Dropdown = ({ trigger, items, onAction }: DropdownProps) => {
  return (
    <DropdownComponent>
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <DropdownMenu aria-label='Dynamic Actions' onAction={onAction}>
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
