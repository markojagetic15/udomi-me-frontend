import { useNavigate } from 'react-router-dom';
import { useUser } from '_entities/user';

export const useAppDrawer = () => {
  const navigate = useNavigate();

  const { user, isError, logout } = useUser();

  return {
    navigate,
    user,
    isError,
    logout,
  };
};
