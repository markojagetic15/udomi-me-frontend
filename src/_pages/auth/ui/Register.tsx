import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  AuthLayout,
  GoogleButton,
  OrDivider,
  PasswordInput,
  PasswordStrength,
} from '_features/auth';
import { Button, Checkbox, FormField, Input } from '_shared';
import { useRegisterPage } from '../hooks';

export const Register = () => {
  const { t } = useTranslation();
  const { form, serverError, isPending, onSubmit } = useRegisterPage();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  return (
    <AuthLayout
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
    >
      <div className='flex flex-col gap-5'>
        <GoogleButton label={t('auth.registerWithGoogle')} />
        <OrDivider />
        <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
          <div className='grid grid-cols-2 gap-3'>
            <FormField
              label={t('auth.firstName')}
              error={errors.first_name?.message}
            >
              <Input
                {...register('first_name')}
                autoComplete='given-name'
                autoFocus
              />
            </FormField>
            <FormField
              label={t('auth.lastName')}
              error={errors.last_name?.message}
            >
              <Input {...register('last_name')} autoComplete='family-name' />
            </FormField>
          </div>
          <FormField label={t('auth.email')} error={errors.email?.message}>
            <Input
              {...register('email')}
              type='email'
              autoComplete='email'
              inputMode='email'
            />
          </FormField>
          <FormField
            label={t('auth.password')}
            error={errors.password?.message}
            hint={t('auth.passwordRules')}
          >
            <PasswordInput
              {...register('password')}
              autoComplete='new-password'
            />
          </FormField>
          <PasswordStrength value={watch('password') ?? ''} />
          <Controller
            control={control}
            name='accept_terms'
            render={({ field }) => (
              <div className='flex flex-col gap-1.5'>
                <label className='flex items-start gap-2.5 text-sm'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    aria-invalid={!!errors.accept_terms}
                    className='mt-0.5'
                  />
                  <span>
                    <Trans
                      i18nKey='auth.acceptTerms'
                      components={{
                        terms: (
                          <Link
                            to='/terms'
                            target='_blank'
                            className='font-medium text-primary underline-offset-4 hover:underline'
                          />
                        ),
                        privacy: (
                          <Link
                            to='/privacy'
                            target='_blank'
                            className='font-medium text-primary underline-offset-4 hover:underline'
                          />
                        ),
                      }}
                    />
                  </span>
                </label>
                {errors.accept_terms && (
                  <p className='text-xs font-medium text-destructive'>
                    {errors.accept_terms.message}
                  </p>
                )}
              </div>
            )}
          />
          {serverError && (
            <p
              role='alert'
              className='rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive'
            >
              {serverError}
            </p>
          )}
          <Button type='submit' size='lg' loading={isPending}>
            {t('auth.createAccount')}
          </Button>
        </form>
        <p className='text-center text-sm text-muted-foreground'>
          {t('auth.haveAccount')}{' '}
          <Link
            to='/login'
            className='font-semibold text-primary hover:underline'
          >
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
