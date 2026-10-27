import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '_features/auth';
import { Button, FormField, Input } from '_shared';
import { useForgotPasswordPage } from '../hooks';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const { form, sent, serverError, isPending, onSubmit } =
    useForgotPasswordPage();
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <AuthLayout
      title={t('auth.forgotTitle')}
      subtitle={sent ? undefined : t('auth.forgotSubtitle')}
    >
      {sent ? (
        <div className='flex flex-col items-start gap-4'>
          <MailCheck className='h-10 w-10 text-primary' />
          <p className='text-muted-foreground'>{t('auth.forgotSent')}</p>
          <Button variant='outline' asChild>
            <Link to='/login'>{t('auth.backToLogin')}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
          <FormField label={t('auth.email')} error={errors.email?.message}>
            <Input
              {...register('email')}
              type='email'
              autoComplete='email'
              autoFocus
            />
          </FormField>
          {serverError && (
            <p role='alert' className='text-sm font-medium text-destructive'>
              {serverError}
            </p>
          )}
          <Button type='submit' size='lg' loading={isPending}>
            {t('auth.sendLink')}
          </Button>
          <Link
            to='/login'
            className='text-center text-sm font-medium text-primary hover:underline'
          >
            {t('auth.backToLogin')}
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};
