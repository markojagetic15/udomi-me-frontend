import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAppDrawer = () => {
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => {
      return axios.get('http://localhost:9000/api/me', {
        withCredentials: true,
      });
    },
  });

  return {
    navigate,
    user: data?.data.user,
    isError,
  };
};
