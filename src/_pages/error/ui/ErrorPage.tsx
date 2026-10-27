import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '_shared';

const KNOWN = ['400', '401', '403', '404', '408', '429', '500', '502', '503'];
const EMOJI: Record<string, string> = {
  '403': '🙅',
  '404': '🐾',
  '429': '🐢',
  '500': '🙀',
};

export const ErrorPage = ({ code: codeProp }: { code?: number }) => {
  const { t } = useTranslation();
  const params = useParams<{ code: string }>();
  const raw = String(codeProp ?? params.code ?? 404);
  const code = KNOWN.includes(raw) ? raw : '404';
  return (
    <div className='container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center'>
      <div className='mb-4 select-none text-7xl'>{EMOJI[code] ?? '😿'}</div>
      <p className='font-display text-6xl font-black text-primary'>{code}</p>
      <h1 className='mt-3 text-2xl font-extrabold'>
        {t(`errorPage.${code}.title`)}
      </h1>
      <p className='mt-2 max-w-md text-muted-foreground'>
        {t(`errorPage.${code}.text`)}
      </p>
      <div className='mt-8 flex gap-3'>
        <Button asChild>
          <Link to='/browse'>{t('landing.ctaBrowse')}</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link to='/'>{t('errorPage.home')}</Link>
        </Button>
      </div>
    </div>
  );
};
