import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const errorEmojis: Record<number, string> = {
  400: '🚫',
  401: '🔐',
  403: '⛔',
  404: '🐾',
  408: '⏱️',
  429: '🐢',
  500: '💥',
  502: '🌐',
  503: '🔧',
};

export const ErrorPage = ({ code }: { code?: number }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const emoji = (code && errorEmojis[code]) || '❓';
  const titleKey = code && t(`errors.${code}.title`, { defaultValue: '' })
    ? `errors.${code}.title`
    : 'errors.default.title';
  const descKey = code && t(`errors.${code}.description`, { defaultValue: '' })
    ? `errors.${code}.description`
    : 'errors.default.description';

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <div className='text-8xl mb-6 select-none'>{emoji}</div>
        {code && (
          <p className='text-6xl font-bold text-primary mb-2'>{code}</p>
        )}
        <h1 className='text-2xl font-bold text-gray-800 mb-3'>{t(titleKey)}</h1>
        <p className='text-gray-600 mb-8'>{t(descKey)}</p>
        <div className='flex gap-3 justify-center'>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 rounded-xl border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors'
          >
            {t('errors.goBack')}
          </button>
          <button
            onClick={() => navigate('/')}
            className='px-6 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity'
          >
            {t('errors.goHome')}
          </button>
        </div>
      </div>
    </div>
  );
};
