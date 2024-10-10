import { useRegister } from '../hooks';
import { Button, Checkbox, Input } from '@shared';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
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
    <div className='flex items-center h-screen'>
      <div className='w-1/2 flex justify-center items-center bg-green-50 h-screen'>
        <h1 className='text-7xl text-white text-shadow'>Register</h1>
      </div>
      <div className='w-1/2 flex flex-col items-center'>
        <form
          className='w-1/2 flex flex-col gap-3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type='text'
            label='First name*'
            name='first_name'
            error={errors.first_name?.message}
            register={register}
          />
          <Input
            type='text'
            label='Last name*'
            name='last_name'
            error={errors.last_name?.message}
            register={register}
          />
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            }
          />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label='Confirm Password*'
            name='confirm_password'
            error={errors.confirm_password?.message}
            register={register}
            endIcon={
              <div onClick={handleToggleConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            }
          />

          <div className='mt-3'>
            <Checkbox
              label='I agree with terms and conditions'
              name='term_and_conditions'
              register={register}
              error={errors.term_and_conditions?.message}
            />
          </div>
          <Button type='submit' margin='54px 0 0 0'>
            Register
          </Button>
        </form>

        <div className='w-1/2 mt-5'>
          <div className='flex gap-2 w-full'>
            Already a member?{' '}
            <div>
              <button
                className='text-green-500'
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
