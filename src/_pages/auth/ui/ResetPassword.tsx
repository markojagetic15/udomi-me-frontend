import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout, PasswordInput, PasswordStrength } from '_features/auth';
import { Button, FormField } from '_shared';
import { useResetPasswordPage } from '../hooks';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const { form, token, done, serverError, isPending, onSubmit } =
    useResetPasswordPage();
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
      ) : !token ? (
        <div className='flex flex-col items-start gap-4'>
          <p className='text-destructive'>{t('errors.INVALID_RESET_LINK')}</p>
          <Button variant='outline' asChild>
            <Link to='/forgot-password'>{t('auth.requestNewLink')}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
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
