import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='bg-white/60 border-t border-gray-100 py-10'>
      <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='text-center md:text-left'>
          <p className='font-bold text-primary text-lg'>{t('nav.brandName')}</p>
          <p className='text-sm text-gray-400 mt-1'>
            &copy; {new Date().getFullYear()} Udomi Me. {t('footer.allRightsReserved')}
          </p>
        </div>

        <div className='flex gap-6 text-sm text-gray-500'>
          <Link to='/browse' className='hover:text-primary transition-colors'>
            {t('footer.browseAnimals')}
          </Link>
          <Link to='/create-listing' className='hover:text-primary transition-colors'>
            {t('footer.listAnAnimal')}
          </Link>
          <Link to='/login' className='hover:text-primary transition-colors'>
            {t('footer.login')}
          </Link>
          <Link to='/register' className='hover:text-primary transition-colors'>
            {t('footer.register')}
          </Link>
        </div>
      </div>
    </footer>
  );
};
