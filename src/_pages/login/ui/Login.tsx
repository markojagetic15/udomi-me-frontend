import { useLogin } from '_features/user';
import { Button, Input } from '_shared';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong, FaGoogle, FaFacebook } from 'react-icons/fa6';
import './styles.css';

export const Login = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    handleTogglePassword,
    navigate,
    errors,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div className="flex items-center h-screen justify-center bg-[url('_assets/register_waves.svg')] relative bg-cover bg-no-repeat">
      <FaArrowLeftLong
        className='text-3xl text-white absolute top-6 left-6 cursor-pointer hover:scale-125 transition duration-300 ease-in-out transform'
        onClick={() => navigate('/')}
      />

      <div className='flex flex-col items-center gap-14 bg-[rgba(185,205,218,0.4)] rounded-2xl border-secondary border-1 border-solid lg:w-auto w-[95%]'>
        <h1 className='text-6xl text-white pt-12 lg:text-8xl'>Login</h1>

        <form
          className='w-[95%] flex flex-col gap-3 lg:p-8 p-4 lg:w-[600px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label='Email'
            name='email'
            register={register('email')}
            error={errors.email?.message}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            label='Password'
            name='password'
            register={register('password')}
            error={errors.password?.message}
            endIcon={
              <div onClick={handleTogglePassword} className='cursor-pointer'>
                {showPassword ? (
                  <FaEyeSlash className='text-primary' />
                ) : (
                  <FaEye className='text-primary' />
                )}
              </div>
            }
          />

          <div className='w-full mt-2'>
            <div className='flex gap-2 w-full'>
              <div>
                <button
                  className='text-primary'
                  onClick={() => navigate('/forgot-password')}
                  type='button'
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          <Button type='submit' variant='flat'>
            Login
          </Button>

          <Button variant='flat' onClick={handleGoogleLogin} color='default'>
            <FaGoogle />
            Login with Google
          </Button>

          <div className='w-full mt-5 pb-12'>
            <div className='flex gap-2 w-full'>
              Don't have an account?{' '}
              <div>
                <button
                  className='text-primary'
                  onClick={() => navigate('/register')}
                  type='button'
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
