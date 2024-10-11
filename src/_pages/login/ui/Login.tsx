import { useLogin } from '_features/user';
import { Button, Input } from '_shared';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import './styles.css';

export const Login = () => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    handleTogglePassword,
    navigate,
  } = useLogin();

  return (
    <div className='flex items-center h-screen'>
      <div className='w-1/2 flex justify-center items-center bg-green-500 h-screen relative'>
        <FaArrowLeftLong
          className='text-3xl text-white absolute top-6 left-6 cursor-pointer hover:scale-125 transition duration-300 ease-in-out transform hover:text-green-700'
          onClick={() => navigate('/')}
        />
        <h1 className='text-8xl text-white text-shadow'>Login</h1>
      </div>
      <div className='w-1/2 flex flex-col items-center'>
        <form
          className='w-1/2 flex flex-col gap-3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type='email'
            label='Email*'
            name='email'
            error={errors.email?.message}
            register={register}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            label='Password*'
            name='password'
            error={errors.password?.message}
            register={register}
            endIcon={
              <div onClick={handleTogglePassword}>
                {showPassword ? (
                  <FaEyeSlash className='text-green-500' />
                ) : (
                  <FaEye className='text-green-500' />
                )}
              </div>
            }
          />

          <Button
            type='submit'
            margin='24px 0 0 0'
            className='hover:text-green-500 hover:bg-green-50 hover:outline outline-green-500 outline-1 transition duration-300 ease-in-out'
          >
            Login
          </Button>
        </form>

        <div className='w-1/2 mt-5'>
          <div className='flex gap-2 w-full'>
            Don't have an account?{' '}
            <div>
              <button
                className='text-green-500'
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
