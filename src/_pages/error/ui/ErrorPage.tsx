import { useNavigate } from 'react-router-dom';

const errorConfig: Record<number, { title: string; description: string; emoji: string }> = {
  400: {
    emoji: '🚫',
    title: 'Bad Request',
    description: 'The request was invalid or could not be understood.',
  },
  401: {
    emoji: '🔐',
    title: 'Unauthorized',
    description: 'You need to be logged in to view this page.',
  },
  403: {
    emoji: '⛔',
    title: 'Forbidden',
    description: "You don't have permission to access this resource.",
  },
  404: {
    emoji: '🐾',
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
  },
  408: {
    emoji: '⏱️',
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
  },
  429: {
    emoji: '🐢',
    title: 'Too Many Requests',
    description: "You've made too many requests. Please slow down and try again later.",
  },
  500: {
    emoji: '💥',
    title: 'Internal Server Error',
    description: 'Something went wrong on our end. Please try again later.',
  },
  502: {
    emoji: '🌐',
    title: 'Bad Gateway',
    description: 'We received an invalid response from the server. Please try again.',
  },
  503: {
    emoji: '🔧',
    title: 'Service Unavailable',
    description: 'The service is temporarily offline for maintenance. Please try again soon.',
  },
};

const defaultError = {
  emoji: '❓',
  title: 'Something Went Wrong',
  description: 'An unexpected error occurred. Please try again.',
};

export const ErrorPage = ({ code }: { code?: number }) => {
  const navigate = useNavigate();
  const config = (code && errorConfig[code]) || defaultError;

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <div className='text-8xl mb-6 select-none'>{config.emoji}</div>
        {code && (
          <p className='text-6xl font-bold text-primary mb-2'>{code}</p>
        )}
        <h1 className='text-2xl font-bold text-gray-800 mb-3'>{config.title}</h1>
        <p className='text-gray-600 mb-8'>{config.description}</p>
        <div className='flex gap-3 justify-center'>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 rounded-xl border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors'
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className='px-6 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity'
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
