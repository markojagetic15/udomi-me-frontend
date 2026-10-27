import { useTranslation } from 'react-i18next';
import { MailWarning } from 'lucide-react';
import { useGlobalContext } from '_app';
import { useResendVerification } from '_entities/user';
import { Button } from '_shared';

export const VerifyEmailBanner = () => {
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const { resendVerification, isPending, isSuccess } = useResendVerification();
  // Only nag once verification can actually be completed (email configured).
  if (!user || user.is_verified || !user.verification_required) return null;
  return (
    <div className='border-b bg-terracotta-50 text-terracotta-700'>
      <div className='container flex flex-col gap-2 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='flex items-center gap-2'>
          <MailWarning className='h-4 w-4 shrink-0' />
          {t('verify.banner', { email: user.email })}
        </p>
        <Button
          size='sm'
          variant='outline'
          className='self-start border-terracotta-500/40 bg-transparent sm:self-auto'
          loading={isPending}
          disabled={isSuccess}
          onClick={() => resendVerification()}
        >
          {isSuccess ? t('verify.resentShort') : t('verify.resend')}
        </Button>
      </div>
    </div>
  );
};
