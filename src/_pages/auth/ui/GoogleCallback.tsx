import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PageLoader } from '_shared';

// The backend already set the session cookie before redirecting here.
export const GoogleCallback = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient
      .invalidateQueries({ queryKey: ['me'] })
      .then(() => navigate('/browse', { replace: true }));
  }, [navigate, queryClient]);
  return <PageLoader />;
};
