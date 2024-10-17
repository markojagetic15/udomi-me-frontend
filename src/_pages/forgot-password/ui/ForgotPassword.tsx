import { useLogin } from '_features/user';
import { Button, Input } from '_shared';
import { FaArrowLeftLong } from 'react-icons/fa6';

export const ForgotPassword = () => {
  const { register, handleSubmit, errors, onSubmit, navigate } = useLogin();

  return (
    <div className='flex items-center h-screen relative'>
      <FaArrowLeftLong
        className='text-3xl text-green-500 absolute top-6 left-6 cursor-pointer hover:scale-125 transition duration-300 ease-in-out transform hover:text-green-700'
        onClick={() => navigate(-1)}
      />
      <div className='w-1/2 flex flex-col items-center relative'>
        <form
          className='w-1/2 flex flex-col gap-3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type='email'
            label='Enter your email address and we will send you instructions to reset your password.'
            name='email'
            error={errors.email?.message}
            register={register}
          />

          <Button
            type='submit'
            margin='24px 0 0 0'
            className='hover:text-green-500 hover:bg-green-50 hover:outline outline-green-500 outline-1 transition duration-300 ease-in-out'
          >
            Submit
          </Button>
        </form>
      </div>

      <div className='w-1/2 flex justify-center items-center bg-green-500 h-screen relative'>
        <h1 className='text-8xl text-white text-shadow'>Forgot Password</h1>
      </div>
    </div>
  );
};
