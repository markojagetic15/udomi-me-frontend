import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Logo = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    to='/'
    onClick={onClick}
    className={cn('group inline-flex items-center gap-2', className)}
  >
    <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6'>
      <PawPrint className='h-5 w-5' />
    </span>
    <span className='font-display text-xl font-extrabold tracking-tight text-primary'>
      Udomi <span className='text-terracotta-500'>me</span>
    </span>
  </Link>
);
