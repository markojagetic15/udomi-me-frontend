import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cookie } from 'lucide-react';
import { Button } from '_shared';

const KEY = 'udomi-cookie-notice';

// We only use strictly necessary storage (session cookie, language choice) —
// no analytics or ad cookies — so this is an information notice, not a
// consent gate (ePrivacy art. 5(3) exemption).
export const CookieNotice = () => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(() => {
    try {
      return !localStorage.getItem(KEY);
    } catch {
      return false;
    }
  });
  if (!show) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* private mode */
    }
    setShow(false);
  };
  return (
    <div
      role='region'
      aria-label={t('cookies.title')}
      className='fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border bg-card p-4 shadow-lift animate-in slide-in-from-bottom-4 sm:inset-x-auto sm:left-4 sm:mx-0'
    >
      <div className='flex gap-3'>
        <Cookie className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
        <div className='flex-1 text-sm'>
          <p>
            {t('cookies.text')}{' '}
            <Link
              to='/privacy#cookies'
              className='font-medium text-primary underline-offset-4 hover:underline'
            >
              {t('cookies.more')}
            </Link>
          </p>
          <Button size='sm' className='mt-3' onClick={dismiss}>
            {t('cookies.ok')}
          </Button>
        </div>
      </div>
    </div>
  );
};
