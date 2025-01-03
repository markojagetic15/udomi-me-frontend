import { useAxios } from '_app';
import { Listing } from '../model';
import { useQuery } from '@tanstack/react-query';

export const useGetListing = (id: string) => {
  const { axios } = useAxios();

  const getListing = useQuery({
    queryKey: ['listings', id],
    queryFn: async (): Promise<{ listing: Listing }> => {
      return await axios.get(`/listings/${id}`);
    },
  });

  return {
    getListing,
  };
};
