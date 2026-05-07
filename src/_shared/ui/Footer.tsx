import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='bg-white/70 backdrop-blur-sm border-t border-white/80'>
      <div className='max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='text-center md:text-left'>
          <div className='flex items-center gap-2 justify-center md:justify-start mb-1'>
            <span className='text-lg'>🐾</span>
            <p className='font-extrabold text-primary text-lg tracking-tight'>{t('nav.brandName')}</p>
          </div>
          <p className='text-xs text-gray-400 mt-1'>
            &copy; {new Date().getFullYear()} Udomi Me. {t('footer.allRightsReserved')}
          </p>
        </div>

        <div className='flex gap-6 text-sm text-gray-500'>
          <Link to='/browse' className='hover:text-primary transition-colors font-medium'>
            {t('footer.browseAnimals')}
          </Link>
          <Link to='/create-listing' className='hover:text-primary transition-colors font-medium'>
            {t('footer.listAnAnimal')}
          </Link>
          <Link to='/login' className='hover:text-primary transition-colors font-medium'>
            {t('footer.login')}
          </Link>
          <Link to='/register' className='hover:text-primary transition-colors font-medium'>
            {t('footer.register')}
          </Link>
        </div>
      </div>
    </footer>
  );
};
