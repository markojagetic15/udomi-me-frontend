import { useLogin } from '_features/user';
import { Button, Input } from '_shared';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong, FaGoogle } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './styles.css';

export const Login = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    handleTogglePassword,
    navigate,
    errors,
    handleGoogleLogin,
    isLoading,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('_assets/register_waves.svg')] relative bg-cover bg-no-repeat px-4">
      <button
        className='absolute top-5 left-5 text-white hover:scale-110 transition-transform'
        onClick={() => navigate('/')}
        aria-label='Go back'
      >
        <FaArrowLeftLong className='text-2xl' />
      </button>

      <div className='w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden'>
        <div className='bg-primary px-8 py-8 text-center'>
          <h1 className='text-4xl font-extrabold text-white tracking-tight'>{t('login.title')}</h1>
          <p className='text-white/80 mt-2 text-sm'>{t('login.subtitle')}</p>
        </div>

        <form className='px-8 py-8 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={t('login.email')}
            name='email'
            register={register('email')}
            error={errors.email?.message}
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('login.password')}
            name='password'
            register={register('password')}
            error={errors.password?.message}
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

          <div className='flex justify-end -mt-1'>
            <Link to='/forgot-password' className='text-sm text-primary hover:underline'>
              {t('login.forgotPassword')}
            </Link>
          </div>

          <Button type='submit' variant='solid' isLoading={isLoading}>
            {t('login.signIn')}
          </Button>

          <div className='relative flex items-center gap-3'>
            <div className='flex-1 h-px bg-gray-200' />
            <span className='text-xs text-gray-400'>{t('login.or')}</span>
            <div className='flex-1 h-px bg-gray-200' />
          </div>

          <Button variant='bordered' onClick={handleGoogleLogin} color='default'>
            <FaGoogle />
            {t('login.continueWithGoogle')}
          </Button>

          <p className='text-center text-sm text-gray-500 pb-2'>
            {t('login.noAccount')}{' '}
            <Link to='/register' className='text-primary font-medium hover:underline'>
              {t('login.register')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
