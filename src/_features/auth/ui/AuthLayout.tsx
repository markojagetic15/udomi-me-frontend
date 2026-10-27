import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '_shared';

// Split screen: form on the left, brand panel on the right (desktop).
export const AuthLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <div className='grid min-h-[100dvh] lg:grid-cols-2'>
      <div className='flex flex-col px-5 py-6 sm:px-10'>
        <Logo />
        <div className='mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10'>
          <h1 className='text-3xl font-extrabold'>{title}</h1>
          {subtitle && <p className='mt-2 text-muted-foreground'>{subtitle}</p>}
          <div className='mt-8'>{children}</div>
        </div>
      </div>
      <div className='relative hidden overflow-hidden bg-primary lg:block'>
        <div className='bg-paws absolute inset-0 opacity-60 mix-blend-overlay' />
        <div className='absolute inset-0 bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900' />
        <div className='relative flex h-full flex-col justify-end p-12 text-white'>
          <div className='mb-8 flex gap-3 text-6xl'>
            <span className='animate-float'>🐕</span>
            <span className='animate-float [animation-delay:1.5s]'>🐈</span>
            <span className='animate-float [animation-delay:3s]'>🐇</span>
          </div>
          <blockquote className='max-w-md font-display text-3xl font-bold leading-snug'>
            {t('auth.quote')}
          </blockquote>
          <p className='mt-4 text-white/70'>{t('auth.quoteSub')}</p>
        </div>
      </div>
    </div>
  );
};
