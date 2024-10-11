import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '_app';

export const useUser = () => {
  const navigate = useNavigate();
  const { axios } = useAxios();

  const { data, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => {
      return axios.get('/me');
    },
  });

  const { mutate } = useMutation({
    mutationFn: () => {
      return axios.post('/logout');
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  return {
    navigate,
    user: data?.data.user,
    isError,
    logout: mutate,
  };
};
