import { useUser } from '_entities/user';
import { useNavigate } from 'react-router-dom';

const AuthRoutes = ['/login', '/register'];

const NotAuthRoutes = ['/create-listing', '/profile', '/my-listings'];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const navigate = useNavigate();

  if (user.user && AuthRoutes.includes(window.location.pathname)) {
    navigate('/');
  }

  if (!user.user && NotAuthRoutes.includes(window.location.pathname)) {
    navigate('/login');
  }

  return <>{children}</>;
};
