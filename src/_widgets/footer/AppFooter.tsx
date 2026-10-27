import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalContext } from '_app';
import { Logo } from '_shared';

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className='text-sm text-muted-foreground transition-colors hover:text-foreground'
  >
    {children}
  </Link>
);

export const AppFooter = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalContext();
  return (
    <footer className='mt-16 border-t bg-card'>
      <div className='container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col gap-3'>
          <Logo />
          <p className='max-w-xs text-sm text-muted-foreground'>
            {t('footer.tagline')}
          </p>
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='font-display font-bold'>{t('footer.explore')}</h3>
          <FooterLink to='/browse'>{t('nav.adopt')}</FooterLink>
          <FooterLink to='/lost-found'>{t('nav.lostFound')}</FooterLink>
          <FooterLink to='/stories'>{t('nav.stories')}</FooterLink>
          <FooterLink to='/browse?shelter_only=1'>
            {t('footer.shelters')}
          </FooterLink>
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='font-display font-bold'>{t('footer.account')}</h3>
          <FooterLink to='/create-listing'>{t('nav.createListing')}</FooterLink>
          {isLoggedIn ? (
            <>
              <FooterLink to='/profile'>{t('nav.myListings')}</FooterLink>
              <FooterLink to='/messages'>{t('nav.messages')}</FooterLink>
            </>
          ) : (
            <>
              <FooterLink to='/login'>{t('nav.login')}</FooterLink>
              <FooterLink to='/register'>{t('nav.register')}</FooterLink>
            </>
          )}
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='font-display font-bold'>{t('footer.legal')}</h3>
          <FooterLink to='/privacy'>{t('footer.privacy')}</FooterLink>
          <FooterLink to='/terms'>{t('footer.terms')}</FooterLink>
        </div>
      </div>
      <div className='border-t'>
        <div className='container flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between'>
          <p>
            © {new Date().getFullYear()} Udomi me. {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
};
