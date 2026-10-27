import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input, cn } from '_shared';

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  return (
    <div className='relative'>
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        className={cn('pr-11', className)}
        {...props}
      />
      <button
        type='button'
        onClick={() => setShow((s) => !s)}
        className='absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground'
        aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
      >
        {show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

// 0-4 rough strength for a visual hint only (rules are enforced by the schema).
export const PasswordStrength = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  if (!value) return null;
  const score = [
    value.length >= 8,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /\W/.test(value),
    value.length >= 12,
  ].filter(Boolean).length;
  const level = score <= 2 ? 0 : score === 3 ? 1 : score === 4 ? 2 : 3;
  const colors = [
    'bg-destructive',
    'bg-terracotta-500',
    'bg-sage-500',
    'bg-primary',
  ];
  return (
    <div className='flex items-center gap-2'>
      <div className='flex flex-1 gap-1'>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i <= level ? colors[level] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <span className='text-xs text-muted-foreground'>
        {t(`auth.strength.${level}`)}
      </span>
    </div>
  );
};
