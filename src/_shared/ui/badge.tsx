import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors [&_svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground bg-card',
        urgent: 'border-transparent bg-terracotta-500 text-white',
        warm: 'border-transparent bg-terracotta-50 text-terracotta-700',
        success: 'border-transparent bg-emerald-100 text-emerald-800',
        destructive: 'border-transparent bg-destructive/10 text-destructive',
        glass: 'border-white/40 bg-white/85 text-foreground backdrop-blur',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
