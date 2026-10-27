import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AuthLayout,
  GoogleButton,
  OrDivider,
  PasswordInput,
} from '_features/auth';
import { Button, FormField, Input } from '_shared';
import { useLoginPage } from '../hooks';

export const Login = () => {
  const { t } = useTranslation();
  const { form, serverError, isPending, onSubmit, next } = useLoginPage();
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <div className='flex flex-col gap-5'>
        <GoogleButton />
        <OrDivider />
        <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
          <FormField label={t('auth.email')} error={errors.email?.message}>
            <Input
              {...register('email')}
              type='email'
              autoComplete='email'
              inputMode='email'
              autoFocus
            />
          </FormField>
          <FormField
            label={t('auth.password')}
            error={errors.password?.message}
          >
            <PasswordInput
              {...register('password')}
              autoComplete='current-password'
            />
          </FormField>
          <Link
            to='/forgot-password'
            className='-mt-1 self-end text-sm font-medium text-primary hover:underline'
          >
            {t('auth.forgot')}
          </Link>
          {serverError && (
            <p
              role='alert'
              className='rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive'
            >
              {serverError}
            </p>
          )}
          <Button type='submit' size='lg' loading={isPending}>
            {t('auth.login')}
          </Button>
        </form>
        <p className='text-center text-sm text-muted-foreground'>
          {t('auth.noAccount')}{' '}
          <Link
            to={`/register${next !== '/browse' ? `?next=${encodeURIComponent(next)}` : ''}`}
            className='font-semibold text-primary hover:underline'
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
