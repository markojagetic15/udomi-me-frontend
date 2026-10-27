import { useAxios } from '_app';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PublicProfile } from '../model';
import type { ListingsResponse } from '../../listing';

export const useGetPublicProfile = (id: string) => {
  const { axios } = useAxios();
  const getPublicProfile = useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<PublicProfile> => axios.get(`/users/${id}`),
    enabled: !!id,
  });
  return { getPublicProfile };
};

export const useGetUserListings = (id: string, page: number) => {
  const { axios } = useAxios();
  const getUserListings = useQuery({
    queryKey: ['user', id, 'listings', page],
    queryFn: async (): Promise<ListingsResponse> =>
      axios.get(`/users/${id}/listings?page=${page}&limit=12`),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
  return { getUserListings };
};
