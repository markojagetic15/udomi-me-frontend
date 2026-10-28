import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, Link2Off } from 'lucide-react';
import { AuthLayout, PasswordInput, PasswordStrength } from '_features/auth';
import { Button, FormField, Spinner } from '_shared';
import { useResetPasswordPage } from '../hooks';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const {
    form,
    done,
    checking,
    linkError,
    linkExpired,
    accountEmail,
    serverError,
    isPending,
    onSubmit,
  } = useResetPasswordPage();
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  return (
    <AuthLayout title={t('auth.resetTitle')}>
      {done ? (
        <div className='flex flex-col items-start gap-4'>
          <CheckCircle2 className='h-10 w-10 text-primary' />
          <p className='text-muted-foreground'>{t('auth.resetDone')}</p>
          <Button asChild>
            <Link to='/login'>{t('auth.login')}</Link>
          </Button>
        </div>
      ) : checking ? (
        <div className='flex items-center gap-3 text-muted-foreground'>
          <Spinner className='h-5 w-5' /> {t('auth.checkingLink')}
        </div>
      ) : linkError ? (
        <div className='flex flex-col items-start gap-4'>
          <div className='flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive'>
            {linkExpired ? (
              <Clock className='mt-0.5 h-5 w-5 shrink-0' />
            ) : (
              <Link2Off className='mt-0.5 h-5 w-5 shrink-0' />
            )}
            <p role='alert'>{linkError}</p>
          </div>
          <Button asChild>
            <Link to='/forgot-password'>{t('auth.requestNewLink')}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
          {accountEmail && (
            <p className='text-sm text-muted-foreground'>
              {t('auth.resetFor', { email: accountEmail })}
            </p>
          )}
          <FormField
            label={t('settings.newPassword')}
            error={errors.password?.message}
            hint={t('auth.passwordRules')}
          >
            <PasswordInput
              {...register('password')}
              autoComplete='new-password'
              autoFocus
            />
          </FormField>
          <PasswordStrength value={watch('password') ?? ''} />
          <FormField
            label={t('auth.confirmPassword')}
            error={errors.confirm?.message}
          >
            <PasswordInput
              {...register('confirm')}
              autoComplete='new-password'
            />
          </FormField>
          {serverError && (
            <p role='alert' className='text-sm font-medium text-destructive'>
              {serverError}{' '}
              <Link to='/forgot-password' className='underline'>
                {t('auth.requestNewLink')}
              </Link>
            </p>
          )}
          <Button type='submit' size='lg' loading={isPending}>
            {t('auth.resetSubmit')}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};
