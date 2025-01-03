import { useAxios } from '_app';
import { useQuery } from '@tanstack/react-query';
import { User } from '../model';

export const useGetUser = (id: string) => {
  const { axios } = useAxios();

  const getUserById = useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<{ listing: User }> => {
      return await axios.get(`/users/${id}`);
    },
  });

  return {
    getUserById,
  };
};
