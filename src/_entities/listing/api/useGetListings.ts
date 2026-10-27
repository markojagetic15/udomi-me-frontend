import { useAxios } from '_app';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ListingsResponse } from '../model';

// `params` is the full browse query (filters + page + limit), already
// serialized by the listing-filters feature.
export const useGetListings = (params: Record<string, string>) => {
  const { axios } = useAxios();
  const getListings = useQuery({
    queryKey: ['listings', 'search', params],
    queryFn: async (): Promise<ListingsResponse> =>
      axios.get(`/listings?${new URLSearchParams(params)}`),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });
  return { getListings };
};

export const useGetAdoptedListings = (page: number, limit = 12) => {
  const { axios } = useAxios();
  const getAdoptedListings = useQuery({
    queryKey: ['listings', 'adopted', page, limit],
    queryFn: async (): Promise<ListingsResponse> =>
      axios.get(`/listings/adopted?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });
  return { getAdoptedListings };
};
