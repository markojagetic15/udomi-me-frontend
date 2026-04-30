import { useForgotPassword } from '_features/user';
import { Button, Input } from '_shared';
import { FaArrowLeftLong } from 'react-icons/fa6';

export const ForgotPassword = () => {
  const { register, handleSubmit, errors, onSubmit, navigate, isLoading, isSuccess } =
    useForgotPassword();

  return (
    <div className='min-h-screen flex items-center justify-center bg-[url("_assets/circles.svg")] relative bg-cover bg-no-repeat px-4'>
      <button
        className='absolute top-5 left-5 text-white hover:scale-110 transition-transform'
        onClick={() => navigate('/login')}
        aria-label='Go back'
      >
        <FaArrowLeftLong className='text-2xl' />
      </button>

      <div className='w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden'>
        <div className='bg-primary px-8 py-8 text-center'>
          <h1 className='text-4xl font-extrabold text-white tracking-tight'>Forgot Password</h1>
          <p className='text-white/80 mt-2 text-sm'>Enter your email and we'll send you a reset link</p>
        </div>

        <div className='px-8 py-8'>
          {isSuccess ? (
            <div className='flex flex-col items-center gap-4 py-4 text-center'>
              <div className='text-5xl'>📬</div>
              <h2 className='text-xl font-bold text-gray-800'>Check your inbox!</h2>
              <p className='text-gray-500 text-sm'>
                If this email exists in our system, you'll receive a password reset link shortly.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='mt-4 w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity'
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
              <Input
                label='Email address'
                name='email'
                error={errors.email?.message}
                register={register('email')}
                isRequired
              />
              <Button type='submit' variant='solid' isLoading={isLoading}>
                Send Reset Link
              </Button>
              <p className='text-center text-sm text-gray-500'>
                Remembered your password?{' '}
                <button
                  type='button'
                  onClick={() => navigate('/login')}
                  className='text-primary font-medium hover:underline'
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
