import { useAxios } from '_app';
import { Listing } from '_entities/listing';
import { useQuery } from '@tanstack/react-query';

export const useGetListing = (id: string) => {
  const { axios } = useAxios();

  const getListing = useQuery({
    queryKey: ['listings', id],
    queryFn: async (): Promise<{ listing: Listing }> => {
      const response = await axios.get(`/listings/${id}`);
      return response.data;
    },
  });

  return {
    getListing,
  };
};
