import { Button, Checkbox, Input } from '_shared';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong, FaGoogle } from 'react-icons/fa6';
import { useRegister } from '_features/user';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';

const TermsModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl'>
        <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
          <h2 className='text-lg font-bold text-gray-900'>{t('register.terms.title')}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl leading-none'>&times;</button>
        </div>
        <div className='px-6 py-5 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4'>
          <p><strong>{t('register.terms.lastUpdated')}</strong> 2026</p>
          <p>{t('register.terms.intro')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section1Title')}</h3>
          <p>{t('register.terms.section1Text')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section2Title')}</h3>
          <p>{t('register.terms.section2Text')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section3Title')}</h3>
          <p>{t('register.terms.section3Text')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section4Title')}</h3>
          <p>{t('register.terms.section4Text')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section5Title')}</h3>
          <p>{t('register.terms.section5Text')}</p>
          <h3 className='font-semibold text-gray-800'>{t('register.terms.section6Title')}</h3>
          <p>{t('register.terms.section6Text')}</p>
        </div>
        <div className='px-6 py-4 border-t border-gray-100'>
          <button
            onClick={onClose}
            className='w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity'
          >
            {t('register.terms.iUnderstand')}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const [showTerms, setShowTerms] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    showConfirmPassword,
    handleTogglePassword,
    handleToggleConfirmPassword,
    navigate,
    handleGoogleRegister,
    isLoading,
  } = useRegister();

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <div className="min-h-screen flex items-center justify-center bg-[url('_assets/register_circles.svg')] relative bg-cover bg-no-repeat px-4 py-8">
        <button
          className='absolute top-5 left-5 text-white hover:scale-110 transition-transform'
          onClick={() => navigate('/')}
          aria-label='Go back'
        >
          <FaArrowLeftLong className='text-2xl' />
        </button>

        <div className='w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden'>
          <div className='bg-primary px-8 py-8 text-center'>
            <h1 className='text-4xl font-extrabold text-white tracking-tight'>{t('register.title')}</h1>
            <p className='text-white/80 mt-2 text-sm'>{t('register.subtitle')}</p>
          </div>

          <form className='px-8 py-6 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-3'>
              <Input
                label={t('register.firstName')}
                name='first_name'
                error={errors.first_name?.message}
                register={register('first_name')}
                isRequired
              />
              <Input
                label={t('register.lastName')}
                name='last_name'
                error={errors.last_name?.message}
                register={register('last_name')}
                isRequired
              />
            </div>

            <Input
              label={t('register.email')}
              name='email'
              error={errors.email?.message}
              register={register('email')}
              isRequired
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label={t('register.password')}
              name='password'
              error={errors.password?.message}
              register={register('password')}
              isRequired
              endIcon={
                <button
                  type='button'
                  onClick={handleTogglePassword}
                  className='flex items-center justify-center text-gray-400 hover:text-gray-600'
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              }
            />

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('register.confirmPassword')}
              name='confirm_password'
              error={errors.confirm_password?.message}
              register={register('confirm_password')}
              isRequired
              endIcon={
                <button
                  type='button'
                  onClick={handleToggleConfirmPassword}
                  className='flex items-center justify-center text-gray-400 hover:text-gray-600'
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              }
            />

            <div className='flex flex-col gap-1'>
              <div className='flex items-start gap-3'>
                <Checkbox
                  label=''
                  register={register('term_and_conditions')}
                  error={undefined}
                />
                <span className='text-sm text-gray-600 mt-0.5'>
                  {t('register.agreeToTerms')}{' '}
                  <button
                    type='button'
                    className='text-primary font-medium underline'
                    onClick={() => setShowTerms(true)}
                  >
                    {t('register.termsAndConditions')}
                  </button>
                </span>
              </div>
              {errors.term_and_conditions?.message && (
                <p className='text-red-500 text-xs ml-8'>{errors.term_and_conditions.message}</p>
              )}
            </div>

            <Button type='submit' variant='solid' isLoading={isLoading}>
              {t('register.createAccount')}
            </Button>

            <div className='relative flex items-center gap-3'>
              <div className='flex-1 h-px bg-gray-200' />
              <span className='text-xs text-gray-400'>{t('register.or')}</span>
              <div className='flex-1 h-px bg-gray-200' />
            </div>

            <Button variant='bordered' onClick={handleGoogleRegister} color='default'>
              <FaGoogle />
              {t('register.continueWithGoogle')}
            </Button>

            <p className='text-center text-sm text-gray-500 pb-2'>
              {t('register.alreadyHaveAccount')}{' '}
              <Link to='/login' className='text-primary font-medium hover:underline'>
                {t('register.signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
