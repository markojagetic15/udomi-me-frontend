import { Button, Checkbox, Input } from '_shared';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong, FaGoogle } from 'react-icons/fa6';
import { useRegister } from '_features/user';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './styles.css';

const TermsModal = ({ onClose }: { onClose: () => void }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
    <div className='bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl'>
      <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900'>Terms & Conditions</h2>
        <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl leading-none'>&times;</button>
      </div>
      <div className='px-6 py-5 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4'>
        <p><strong>Last updated:</strong> 2026</p>
        <p>By using Udomi Me, you agree to the following terms. Please read them carefully.</p>
        <h3 className='font-semibold text-gray-800'>1. Use of Service</h3>
        <p>Udomi Me is a free platform to connect animals in need with loving adopters. You agree to use the platform only for lawful purposes and in a manner consistent with animal welfare.</p>
        <h3 className='font-semibold text-gray-800'>2. Listings</h3>
        <p>You are responsible for the accuracy of all listings you post. Misleading, fraudulent, or abusive listings are strictly prohibited and will result in account removal.</p>
        <h3 className='font-semibold text-gray-800'>3. Privacy</h3>
        <p>We collect your name, email, and listing data to operate the service. We do not sell your personal data to third parties. Contact information shared on listings is your responsibility.</p>
        <h3 className='font-semibold text-gray-800'>4. Animal Welfare</h3>
        <p>All users must ensure the welfare of animals listed or adopted through this platform. Udomi Me does not accept responsibility for the condition or care of animals after adoption.</p>
        <h3 className='font-semibold text-gray-800'>5. Account Termination</h3>
        <p>We reserve the right to terminate accounts that violate these terms, without prior notice.</p>
        <h3 className='font-semibold text-gray-800'>6. Changes</h3>
        <p>We may update these terms from time to time. Continued use of the service constitutes acceptance of any changes.</p>
      </div>
      <div className='px-6 py-4 border-t border-gray-100'>
        <button
          onClick={onClose}
          className='w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity'
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);

export const Register = () => {
  const [showTerms, setShowTerms] = useState(false);
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
            <h1 className='text-4xl font-extrabold text-white tracking-tight'>Create account</h1>
            <p className='text-white/80 mt-2 text-sm'>Join Udomi Me and help animals find homes</p>
          </div>

          <form className='px-8 py-6 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-3'>
              <Input
                label='First name'
                name='first_name'
                error={errors.first_name?.message}
                register={register('first_name')}
                isRequired
              />
              <Input
                label='Last name'
                name='last_name'
                error={errors.last_name?.message}
                register={register('last_name')}
                isRequired
              />
            </div>

            <Input
              label='Email'
              name='email'
              error={errors.email?.message}
              register={register('email')}
              isRequired
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label='Password'
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
              label='Confirm Password'
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
                  I agree to the{' '}
                  <button
                    type='button'
                    className='text-primary font-medium underline'
                    onClick={() => setShowTerms(true)}
                  >
                    Terms & Conditions
                  </button>
                </span>
              </div>
              {errors.term_and_conditions?.message && (
                <p className='text-red-500 text-xs ml-8'>{errors.term_and_conditions.message}</p>
              )}
            </div>

            <Button type='submit' variant='solid' isLoading={isLoading}>
              Create Account
            </Button>

            <div className='relative flex items-center gap-3'>
              <div className='flex-1 h-px bg-gray-200' />
              <span className='text-xs text-gray-400'>or</span>
              <div className='flex-1 h-px bg-gray-200' />
            </div>

            <Button variant='bordered' onClick={handleGoogleRegister} color='default'>
              <FaGoogle />
              Continue with Google
            </Button>

            <p className='text-center text-sm text-gray-500 pb-2'>
              Already have an account?{' '}
              <Link to='/login' className='text-primary font-medium hover:underline'>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
