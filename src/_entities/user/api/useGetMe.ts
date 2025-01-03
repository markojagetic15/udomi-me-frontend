import { useAxios } from '_app';
import { useQuery } from '@tanstack/react-query';
import { User } from '../model';

export const useGetMe = () => {
  const { axios } = useAxios();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return (await axios.get('/me')) as User;
    },
  });

  return {
    user: data,
    isError,
    isLoading,
  };
};
