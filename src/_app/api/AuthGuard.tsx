import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from './useGlobalContext';

const AuthRoutes = ['/login', '/register'];

const NotAuthRoutes = ['/create-listing', '/profile', '/my-listings'];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  if (user?.id && AuthRoutes.includes(window.location.pathname)) {
    navigate('/');
  }

  if (!user?.id && NotAuthRoutes.includes(window.location.pathname)) {
    navigate('/login');
  }

  return <>{children}</>;
};
