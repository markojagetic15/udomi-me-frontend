import { useAxios } from '_app';
import { GetAllListingsResponse } from '../model';
import { useQuery } from '@tanstack/react-query';

export const useGetMyListings = () => {
  const { axios } = useAxios();

  const getAllListings = useQuery({
    queryKey: ['my-listings'],
    queryFn: async (): Promise<GetAllListingsResponse> => {
      return await axios.get('/listings/user?page=1&limit=10');
    },
  });

  return {
    getAllListings,
  };
};
