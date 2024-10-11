import { useAppDrawer } from '../hooks';
import { Avatar, Button, Dropdown, DropdownItem } from '@shared';
import { TbLogout2 } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { FaList } from 'react-icons/fa';

export const AppDrawer = () => {
  const { navigate, user, isError } = useAppDrawer();

  if (user && !isError) {
    return (
      <div className='flex justify-between items-center pt-4 pb-4 pl-20 pr-20 bg-[#ECF6EC] fixed w-screen'>
        <img
          src={`${import.meta.env.VITE_APP_S3_ASSETS}/logo.png`}
          alt='logo'
          className='w-14 cursor-pointer'
          onClick={() => navigate('/')}
        />
        <div className='flex gap-8 items-center'>
          <Dropdown
            trigger={
              <div>
                {' '}
                <Avatar user={user} />
              </div>
            }
          >
            <DropdownItem className='flex gap-2'>
              <FaList />
              My listings
            </DropdownItem>
            <DropdownItem className='flex gap-2'>
              <CgProfile />
              My profile
            </DropdownItem>
            <DropdownItem className='flex gap-2'>
              <TbLogout2 />
              Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-between items-center pt-4 pb-4 pl-20 pr-20 bg-[#ECF6EC] fixed w-screen'>
      <img
        src={`${import.meta.env.VITE_APP_S3_ASSETS}/logo.png`}
        alt='logo'
        className='w-14 cursor-pointer'
        onClick={() => navigate('/')}
      />
      <div className='flex gap-8 items-center'>
        <span
          onClick={() => navigate('/login')}
          className='cursor-pointer hover:text-green-500 transition duration-300 ease-in-out'
        >
          Register
        </span>

        <Button
          onClick={() => navigate('/login')}
          className='cursor-pointer pl-8 pr-8 hover:bg-[#F0F0F0] hover:text-[#000000] transition duration-300 ease-in-out'
        >
          Login
        </Button>
      </div>
    </div>
  );
};
