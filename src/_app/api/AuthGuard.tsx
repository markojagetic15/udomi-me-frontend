import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from './useGlobalContext';

// AppLayout renders a loader until the /me query settles, so `user` here is final.
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useGlobalContext();
  const location = useLocation();
  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }
  return <>{children}</>;
};

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useGlobalContext();
  const location = useLocation();
  if (isLoggedIn) {
    const next = new URLSearchParams(location.search).get('next');
    // Only same-site paths — never redirect to an arbitrary URL.
    return (
      <Navigate
        to={next?.startsWith('/') && !next.startsWith('//') ? next : '/browse'}
        replace
      />
    );
  }
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin } = useGlobalContext();
  if (!isLoggedIn) return <Navigate to='/login?next=/admin' replace />;
  if (!isAdmin) return <Navigate to='/error/403' replace />;
  return <>{children}</>;
};
