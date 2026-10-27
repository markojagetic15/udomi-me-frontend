import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useVerifyEmail } from '_entities/user';
import { Button, Card, PageLoader } from '_shared';

export const VerifyEmail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useVerifyEmail(searchParams.get('token'));
  if (verifyEmail.isLoading) return <PageLoader />;
  const ok = verifyEmail.isSuccess;
  return (
    <div className='container flex max-w-md justify-center py-16'>
      <Card className='flex w-full flex-col items-center gap-4 p-8 text-center'>
        {ok ? (
          <CheckCircle2 className='h-12 w-12 text-primary' />
        ) : (
          <XCircle className='h-12 w-12 text-destructive' />
        )}
        <h1 className='text-2xl font-extrabold'>
          {ok ? t('verify.successTitle') : t('verify.failTitle')}
        </h1>
        <p className='text-muted-foreground'>
          {ok ? t('verify.successText') : t('errors.INVALID_VERIFICATION_LINK')}
        </p>
        <Button asChild>
          <Link to={ok ? '/create-listing' : '/profile?tab=settings'}>
            {ok ? t('nav.createListing') : t('nav.settings')}
          </Link>
        </Button>
      </Card>
    </div>
  );
};
