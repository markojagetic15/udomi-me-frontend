import * as React from 'react';
import { cn } from '../lib/utils';

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 px-6 py-14 text-center',
      className
    )}
  >
    {icon && (
      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary [&_svg]:h-7 [&_svg]:w-7'>
        {icon}
      </div>
    )}
    <h3 className='text-lg font-bold'>{title}</h3>
    {description && (
      <p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
        {description}
      </p>
    )}
    {action && <div className='mt-5'>{action}</div>}
  </div>
);
