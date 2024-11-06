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
        onClick={() => navigate(-1)}
      />

      <div className='flex flex-col items-center gap-2 bg-[rgba(185,205,218,0.4)] rounded-2xl'>
        <h1 className='text-8xl text-white pt-2'>Register</h1>

        <form
          className='w-[700px] flex flex-col gap-3 p-8'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type='text'
            label='First name*'
            name='first_name'
            error={errors.first_name?.message}
            register={register('first_name')}
          />
          <Input
            type='text'
            label='Last name*'
            name='last_name'
            error={errors.last_name?.message}
            register={register('last_name')}
          />
          <Input
            type='email'
            label='Email*'
            name='email'
            error={errors.email?.message}
            register={register('email')}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            label='Password*'
            name='password'
            error={errors.password?.message}
            register={register('password')}
            endIcon={
              <div onClick={handleTogglePassword}>
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
              <div onClick={handleToggleConfirmPassword}>
                {showConfirmPassword ? (
                  <FaEyeSlash className='text-primary' />
                ) : (
                  <FaEye className='text-primary' />
                )}
              </div>
            }
          />

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
          <div className='w-1/2 mt-5 pb-2'>
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
