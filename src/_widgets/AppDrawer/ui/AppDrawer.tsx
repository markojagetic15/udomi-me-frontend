import { useAppDrawer } from '../hooks';
import { Avatar, Button, Dropdown } from '_shared';
import { TbLogout2 } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export const AppDrawer = () => {
  const { navigate, user, logout } = useAppDrawer();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  const MobileMenu = () => (
    <div className='fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col'>
      <div className='bg-white w-72 ml-auto h-full flex flex-col p-6 gap-4 shadow-2xl'>
        <div className='flex items-center justify-between mb-4'>
          <span className='font-bold text-primary text-lg'>UDOMI ME</span>
          <button onClick={() => setMobileOpen(false)} className='text-gray-500 hover:text-gray-800'>
            <HiX size={24} />
          </button>
        </div>
        {user?.id ? (
          <>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium'
              onClick={() => { navigate('/create-listing'); setMobileOpen(false); }}
            >
              Create Listing
            </button>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium'
              onClick={() => { navigate('/profile'); setMobileOpen(false); }}
            >
              Profile
            </button>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-red-50 text-red-500 font-medium mt-auto'
              onClick={() => { logout(); setMobileOpen(false); }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className='text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium'
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
            >
              Sign In
            </button>
            <button
              className='w-full py-3 rounded-xl bg-primary text-white font-semibold text-center hover:opacity-90 transition-opacity'
              onClick={() => { navigate('/register'); setMobileOpen(false); }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (user?.id) {
    return (
      <>
        {mobileOpen && <MobileMenu />}
        <Navbar
          shouldHideOnScroll={!isLanding}
          isBordered={!isLanding}
          isBlurred={!isLanding}
          className={isLanding ? 'fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none shadow-none border-none' : ''}
          classNames={isLanding ? { base: 'bg-transparent border-none shadow-none' } : {}}
        >
          <NavbarBrand>
            <p
              className={`font-bold cursor-pointer ${isLanding ? 'text-white' : 'text-inherit'}`}
              onClick={() => navigate('/')}
            >
              UDOMI ME
            </p>
          </NavbarBrand>
          <NavbarContent justify='center' />
          <NavbarContent justify='end'>
            <NavbarItem className='hidden lg:flex'>
              <Button
                onClick={() => navigate('/create-listing')}
                variant='bordered'
                className={isLanding ? 'border-white text-white hover:bg-white/20' : ''}
              >
                <FaPlus />
                Create listing
              </Button>
            </NavbarItem>
            <NavbarItem className='hidden lg:flex'>
              <Dropdown
                trigger={
                  <div>
                    <Avatar user={user} />
                  </div>
                }
                items={[
                  {
                    key: 'profile',
                    label: 'Profile',
                    icon: <CgProfile />,
                    onClick: () => navigate('/profile'),
                  },
                  {
                    key: 'logout',
                    label: 'Logout',
                    icon: <TbLogout2 />,
                    onClick: logout,
                  },
                ]}
              />
            </NavbarItem>
            <NavbarItem className='lg:hidden'>
              <button
                onClick={() => setMobileOpen(true)}
                className={`p-1 ${isLanding ? 'text-white' : 'text-gray-600'}`}
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
      <Navbar
        shouldHideOnScroll={!isLanding}
        isBordered={!isLanding}
        isBlurred={!isLanding}
        className={isLanding ? 'fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none shadow-none border-none' : ''}
        classNames={isLanding ? { base: 'bg-transparent border-none shadow-none' } : {}}
      >
        <NavbarBrand>
          <p
            className={`font-bold cursor-pointer ${isLanding ? 'text-white' : 'text-inherit'}`}
            onClick={() => navigate('/')}
          >
            UDOMI ME
          </p>
        </NavbarBrand>
        <NavbarContent justify='center' />
        <NavbarContent justify='end'>
          <NavbarItem className='hidden lg:flex'>
            <Button
              onClick={() => navigate('/register')}
              variant='bordered'
              className={isLanding ? 'border-white text-white hover:bg-white/20' : ''}
            >
              Register
            </Button>
          </NavbarItem>
          <NavbarItem className='hidden lg:flex'>
            <Button
              onClick={() => navigate('/login')}
              variant='solid'
              className={isLanding ? 'bg-white text-primary hover:opacity-90' : ''}
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem className='lg:hidden'>
            <button
              onClick={() => setMobileOpen(true)}
              className={`p-1 ${isLanding ? 'text-white' : 'text-gray-600'}`}
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
