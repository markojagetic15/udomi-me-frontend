import { useForgotPassword } from '_features/user';
import { Button, Input } from '_shared';
import { FaArrowLeftLong } from 'react-icons/fa6';

export const ForgotPassword = () => {
  const { register, handleSubmit, errors, onSubmit, navigate } =
    useForgotPassword();

  return (
    <div className="flex items-center h-screen justify-center bg-[url('_assets/circles.svg')] relative bg-cover bg-no-repeat">
      <FaArrowLeftLong
        className='text-3xl text-white absolute top-6 left-6 cursor-pointer hover:scale-125 transition duration-300 ease-in-out transform'
        onClick={() => navigate(-1)}
      />
      <div className='w-1/2 flex flex-col items-center gap-14'>
        <h1 className='text-8xl text-white text-center w-full'>
          Forgot Password
        </h1>

        <form
          className='w-full flex flex-col gap-3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type='email'
            label='Enter your email address and we will send you instructions to reset your password.'
            name='email'
            error={errors.email?.message}
            register={register('email')}
          />

          <Button type='submit' variant='flat'>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};
