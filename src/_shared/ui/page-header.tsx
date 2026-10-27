import * as React from 'react';
import { cn } from '../lib/utils';

export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between',
      className
    )}
  >
    <div>
      <h1 className='text-3xl font-extrabold sm:text-4xl'>{title}</h1>
      {description && (
        <p className='mt-2 max-w-2xl text-muted-foreground'>{description}</p>
      )}
    </div>
    {actions && <div className='flex shrink-0 flex-wrap gap-2'>{actions}</div>}
  </div>
);
