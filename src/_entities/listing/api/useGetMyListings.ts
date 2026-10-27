import { useAxios } from '_app';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Listing, ListingsResponse } from '../model';

export const useGetMyListings = (page: number, limit = 12) => {
  const { axios } = useAxios();
  const getMyListings = useQuery({
    queryKey: ['my-listings', page, limit],
    queryFn: async (): Promise<ListingsResponse> =>
      axios.get(`/listings/user?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });
  return { getMyListings };
};

export const useGetFavorites = (enabled = true) => {
  const { axios } = useAxios();
  const getFavorites = useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Listing[]> => axios.get('/me/favorites'),
    enabled,
  });
  return { getFavorites };
};
