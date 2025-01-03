import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '_app';
import { useLogout } from '_entities/user';

export const useAppDrawer = () => {
  const navigate = useNavigate();

  const { user } = useGlobalContext();

  const { logout } = useLogout();

  return {
    navigate,
    user,
    logout,
  };
};
