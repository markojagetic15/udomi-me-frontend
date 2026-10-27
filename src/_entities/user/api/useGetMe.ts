import { useAxios } from '_app';
import { useQuery } from '@tanstack/react-query';
import { Me } from '../model';

export const useGetMe = () => {
  const { axios } = useAxios();
  const getMe = useQuery({
    queryKey: ['me'],
    queryFn: async (): Promise<Me> => axios.get('/me'),
    // 401 just means "logged out" — don't retry or refetch noisily.
    retry: false,
    staleTime: 60_000,
  });
  return { getMe };
};
