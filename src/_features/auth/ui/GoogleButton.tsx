import { useTranslation } from 'react-i18next';
import { Button } from '_shared';

const GoogleLogo = () => (
  <svg viewBox='0 0 24 24' aria-hidden>
    <path
      fill='#EA4335'
      d='M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.9 2.4 2.8 6.6 2.8 12s4.1 9.6 9.2 9.6c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z'
    />
  </svg>
);

// Plain redirect: the backend runs the OAuth dance and sets the cookie.
export const GoogleButton = ({ label }: { label?: string }) => {
  const { t } = useTranslation();
  return (
    <Button
      type='button'
      variant='outline'
      size='lg'
      className='w-full'
      onClick={() =>
        (window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL as string}/google`)
      }
    >
      <GoogleLogo />
      {label ?? t('auth.continueWithGoogle')}
    </Button>
  );
};

export const OrDivider = () => {
  const { t } = useTranslation();
  return (
    <div className='flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
      <span className='h-px flex-1 bg-border' />
      {t('auth.or')}
      <span className='h-px flex-1 bg-border' />
    </div>
  );
};
