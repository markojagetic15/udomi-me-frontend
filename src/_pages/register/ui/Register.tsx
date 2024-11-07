import { Button, Checkbox, Input } from '_shared';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRegister } from '_features/user';
import './styles.css';

export const Register = () => {
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
  } = useRegister();

  return (
    <div className="flex items-center h-screen justify-center bg-[url('_assets/register_circles.svg')] relative bg-cover bg-no-repeat">
      <FaArrowLeftLong
        className='text-3xl text-white absolute top-6 left-6 cursor-pointer hover:scale-125 transition duration-300 ease-in-out transform'
        onClick={() => navigate('/')}
      />

      <div className='flex flex-col items-center gap-2 bg-[rgba(185,205,218,0.7)] rounded-2xl border-secondary border-1 border-solid lg:w-auto w-[95%]'>
        <h1 className='text-6xl text-white pt-12 lg:text-8xl'>Register</h1>

        <form
          className='p-4 w-[100%] flex flex-col gap-3 lg:p-8 lg:w-[600px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex gap-2 w-full justify-between items-center'>
            <Input
              label='First name*'
              name='first_name'
              error={errors.first_name?.message}
              register={register('first_name')}
            />
            <Input
              label='Last name*'
              name='last_name'
              error={errors.last_name?.message}
              register={register('last_name')}
            />
          </div>
          <Input
            label='Email*'
            name='email'
            error={errors.email?.message}
            register={register('email')}
          />
          <div className='flex gap-2 w-full justify-between items-center flex-col lg:flex-row'>
            <Input
              type={showPassword ? 'text' : 'password'}
              label='Password*'
              name='password'
              error={errors.password?.message}
              register={register('password')}
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
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label='Confirm Password*'
              name='confirm_password'
              error={errors.confirm_password?.message}
              register={register('confirm_password')}
              endIcon={
                <div
                  onClick={handleToggleConfirmPassword}
                  className='cursor-pointer'
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className='text-primary' />
                  ) : (
                    <FaEye className='text-primary' />
                  )}
                </div>
              }
            />
          </div>

          <div className='mt-3'>
            <Checkbox
              label='I agree with terms and conditions'
              register={register('term_and_conditions')}
              error={errors.term_and_conditions?.message}
            />
          </div>
          <Button type='submit' variant='flat'>
            Register
          </Button>
          <div className='w-full mt-5 pb-2'>
            <div className='flex gap-2 w-full'>
              Already a member?{' '}
              <div>
                <button
                  className='text-primary'
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
