import * as React from 'react';
import { cn } from '../lib/utils';
import { Label } from './label';

type ControlProps = {
  id: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

// Label + control + error/hint, with aria wiring. A plain child element gets
// id / aria-invalid / aria-describedby injected; when the real input is nested
// (react-hook-form Controller, Radix Select trigger) pass a render function
// and spread the props onto the actual input instead.
export const FormField = ({
  label,
  error,
  hint,
  required,
  optional,
  className,
  children,
  id: idProp,
}: {
  label?: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  optional?: string;
  className?: string;
  children: React.ReactElement | ((props: ControlProps) => React.ReactElement);
  id?: string;
}) => {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const msgId = `${id}-msg`;
  const controlProps: ControlProps = {
    id,
    'aria-invalid': !!error || undefined,
    'aria-describedby': error || hint ? msgId : undefined,
  };
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={id} className='flex items-baseline gap-1'>
          {label}
          {required && <span className='text-terracotta-600'>*</span>}
          {optional && (
            <span className='text-xs font-normal text-muted-foreground'>
              ({optional})
            </span>
          )}
        </Label>
      )}
      {typeof children === 'function'
        ? children(controlProps)
        : React.cloneElement(children, controlProps)}
      {error ? (
        <p id={msgId} className='text-xs font-medium text-destructive'>
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className='text-xs text-muted-foreground'>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
