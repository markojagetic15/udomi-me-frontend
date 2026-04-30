import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAxios } from '_app';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { axios } = useAxios();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    axios
      .get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center'>
        {status === 'loading' && (
          <>
            <div className='w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-6' />
            <h1 className='text-2xl font-bold text-gray-800'>Verifying your email…</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div className='text-6xl mb-6'>✅</div>
            <h1 className='text-2xl font-bold text-gray-800 mb-3'>Email Verified!</h1>
            <p className='text-gray-500 mb-8'>Your account is now active. You can sign in and start adopting.</p>
            <button
              onClick={() => navigate('/login')}
              className='w-full py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity'
            >
              Sign In
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div className='text-6xl mb-6'>❌</div>
            <h1 className='text-2xl font-bold text-gray-800 mb-3'>Verification Failed</h1>
            <p className='text-gray-500 mb-8'>
              The link may have expired or is invalid. Try registering again.
            </p>
            <button
              onClick={() => navigate('/register')}
              className='w-full py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity'
            >
              Register Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
