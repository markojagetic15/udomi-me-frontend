import { useAxios } from '_app';
import { GetAllListingsResponse } from '_entities/listing';
import { useQuery } from '@tanstack/react-query';

export const useGetMyListings = () => {
  const { axios } = useAxios();

  const getAllListings = useQuery({
    queryKey: ['my-listings'],
    queryFn: async (): Promise<GetAllListingsResponse> => {
      const response = await axios.get('/listings/user?page=1&limit=10');
      return response.data;
    },
  });

  return {
    getAllListings,
  };
};
