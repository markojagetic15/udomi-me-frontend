import { useAxios } from '_app';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '../model';

export const useGetListing = (id: string | undefined) => {
  const { axios } = useAxios();
  const getListing = useQuery({
    queryKey: ['listings', id],
    queryFn: async (): Promise<{ listing: Listing }> =>
      axios.get(`/listings/${id}`),
    enabled: !!id,
  });
  return { getListing };
};
