import { useAppDrawer } from '../hooks';
import { Avatar, Button, Dropdown } from '_shared';
import { TbLogout2 } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { FaList } from 'react-icons/fa';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

export const AppDrawer = () => {
  const { navigate, user, isError, logout } = useAppDrawer();

  if (user && !isError) {
    return (
      <Navbar shouldHideOnScroll isBordered isBlurred>
        <NavbarBrand>
          <p
            className='font-bold text-inherit cursor-pointer'
            onClick={() => navigate('/')}
          >
            UDOMI ME
          </p>
        </NavbarBrand>
        <NavbarContent justify='end'>
          <NavbarItem className='hidden lg:flex'>
            <Button
              onClick={() => navigate('/create-listing')}
              variant='bordered'
            >
              Create listing
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Dropdown
              trigger={
                <div>
                  {' '}
                  <Avatar user={user} />
                </div>
              }
              items={[
                {
                  key: 'my-listings',
                  label: 'My Listings',
                  icon: <FaList />,
                  onClick: () => navigate('/my-listings'),
                },
                { key: 'profile', label: 'Profile', icon: <CgProfile /> },
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <TbLogout2 />,
                  onClick: logout,
                },
              ]}
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  }

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <p
          className='font-bold text-inherit cursor-pointer'
          onClick={() => navigate('/')}
        >
          UDOMI ME
        </p>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem className='hidden lg:flex'>
          <Button onClick={() => navigate('/register')} variant='bordered'>
            Register
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => navigate('/login')} variant='solid'>
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
