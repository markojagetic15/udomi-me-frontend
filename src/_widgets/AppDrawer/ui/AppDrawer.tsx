import { useAppDrawer } from '../hooks';
import { Avatar, Button, Dropdown } from '_shared';
import { TbLogout2 } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isHR = i18n.language === 'hr';

  const toggle = () => {
    i18n.changeLanguage(isHR ? 'en' : 'hr');
  };

  return (
    <button
      onClick={toggle}
      className='px-3 py-1 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors'
      aria-label='Switch language'
    >
      {isHR ? 'EN' : 'HR'}
    </button>
  );
};

export const AppDrawer = () => {
  const { navigate, user, logout } = useAppDrawer();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const MobileMenu = () => (
    <div className='fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col'>
      <div className='bg-white w-72 ml-auto h-full flex flex-col p-6 gap-1 shadow-2xl'>
        <div className='flex items-center justify-between mb-5'>
          <div className='flex items-center gap-2'>
            <span>🐾</span>
            <span className='font-extrabold text-primary text-lg'>{t('nav.brandName')}</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className='text-gray-400 hover:text-gray-700 p-1'>
            <HiX size={22} />
          </button>
        </div>
        <div className='mb-2'>
          <LanguageSwitcher />
        </div>
        {user?.id ? (
          <>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2'
              onClick={() => { navigate('/browse'); setMobileOpen(false); }}
            >
              <MdPets className='text-gray-400 w-4 h-4' />
              {t('footer.browseAnimals')}
            </button>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2'
              onClick={() => { navigate('/create-listing'); setMobileOpen(false); }}
            >
              <FaPlus className='text-gray-400 w-3.5 h-3.5' />
              {t('nav.createListing')}
            </button>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2'
              onClick={() => { navigate('/profile'); setMobileOpen(false); }}
            >
              <CgProfile className='text-gray-400 w-4 h-4' />
              {t('nav.profile')}
            </button>
            <div className='mt-auto pt-4 border-t border-gray-100'>
              <button
                className='w-full text-left py-3 px-4 rounded-xl hover:bg-red-50 text-red-500 font-medium flex items-center gap-2'
                onClick={() => { logout(); setMobileOpen(false); }}
              >
                <TbLogout2 className='w-4 h-4' />
                {t('nav.logout')}
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2'
              onClick={() => { navigate('/browse'); setMobileOpen(false); }}
            >
              <MdPets className='text-gray-400 w-4 h-4' />
              {t('footer.browseAnimals')}
            </button>
            <div className='mt-auto pt-4 flex flex-col gap-2 border-t border-gray-100'>
              <button
                className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium'
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
              >
                {t('nav.signIn')}
              </button>
              <button
                className='w-full py-3 rounded-xl bg-primary text-white font-semibold text-center hover:opacity-90 transition-opacity'
                onClick={() => { navigate('/register'); setMobileOpen(false); }}
              >
                {t('nav.register')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (user?.id) {
    return (
      <>
        {mobileOpen && <MobileMenu />}
        <Navbar isBordered isBlurred>
          <NavbarBrand>
            <div className='flex items-center gap-1.5 cursor-pointer' onClick={() => navigate('/')}>
              <span className='text-primary'>🐾</span>
              <p className='font-extrabold tracking-tight'>{t('nav.brandName')}</p>
            </div>
          </NavbarBrand>
          <NavbarContent justify='center' />
          <NavbarContent justify='end'>
            <NavbarItem className='hidden lg:flex'>
              <LanguageSwitcher />
            </NavbarItem>
            <NavbarItem className='hidden lg:flex'>
              <Button onClick={() => navigate('/create-listing')} variant='bordered'>
                <FaPlus />
                {t('nav.createListing')}
              </Button>
            </NavbarItem>
            <NavbarItem className='hidden lg:flex'>
              <Dropdown
                trigger={<div><Avatar user={user} /></div>}
                items={[
                  {
                    key: 'profile',
                    label: t('nav.profile'),
                    icon: <CgProfile />,
                    onClick: () => navigate('/profile'),
                  },
                  {
                    key: 'logout',
                    label: t('nav.logout'),
                    icon: <TbLogout2 />,
                    onClick: logout,
                  },
                ]}
              />
            </NavbarItem>
            <NavbarItem className='lg:hidden'>
              <button
                onClick={() => setMobileOpen(true)}
                className='p-1 text-gray-600'
                aria-label='Open menu'
              >
                <HiMenuAlt3 size={24} />
              </button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </>
    );
  }

  return (
    <>
      {mobileOpen && <MobileMenu />}
      <Navbar isBordered isBlurred>
        <NavbarBrand>
          <div className='flex items-center gap-1.5 cursor-pointer' onClick={() => navigate('/')}>
            <span className='text-primary'>🐾</span>
            <p className='font-extrabold tracking-tight'>{t('nav.brandName')}</p>
          </div>
        </NavbarBrand>
        <NavbarContent justify='center' />
        <NavbarContent justify='end'>
          <NavbarItem className='hidden lg:flex'>
            <LanguageSwitcher />
          </NavbarItem>
          <NavbarItem className='hidden lg:flex'>
            <Button onClick={() => navigate('/register')} variant='bordered'>
              {t('nav.register')}
            </Button>
          </NavbarItem>
          <NavbarItem className='hidden lg:flex'>
            <Button onClick={() => navigate('/login')} variant='solid'>
              {t('nav.login')}
            </Button>
          </NavbarItem>
          <NavbarItem className='lg:hidden'>
            <button
              onClick={() => setMobileOpen(true)}
              className='p-1 text-gray-600'
              aria-label='Open menu'
            >
              <HiMenuAlt3 size={24} />
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};
