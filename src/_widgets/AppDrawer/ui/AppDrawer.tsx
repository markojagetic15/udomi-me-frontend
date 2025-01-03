import { useAppDrawer } from '../hooks';
import { Avatar, Button, Dropdown } from '_shared';
import { TbLogout2 } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

export const AppDrawer = () => {
  const { navigate, user, logout } = useAppDrawer();

  if (user?.id) {
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
              <FaPlus />
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
