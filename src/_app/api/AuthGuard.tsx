import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from './useGlobalContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useGlobalContext();
  const location = useLocation();

  if (!user?.id) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
};

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useGlobalContext();
  if (user?.id) return <Navigate to='/browse' replace />;
  return <>{children}</>;
};

/** @deprecated use ProtectedRoute / GuestRoute */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
