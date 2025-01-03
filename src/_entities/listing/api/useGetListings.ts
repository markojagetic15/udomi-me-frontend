import { useAxios } from '_app';
import { Category, GetAllListingsResponse } from '../model';
import { useQuery } from '@tanstack/react-query';

export const useGetListings = (
  page: number,
  limit: number,
  search: string,
  categories: Category[]
) => {
  const { axios } = useAxios();

  const getAllListings = useQuery({
    queryKey: ['listings', page, limit, search, categories],
    queryFn: async (): Promise<GetAllListingsResponse> => {
      return await axios.get(
        `/listings?page=${page}&limit=${limit}&search=${search}${categories.length > 0 ? `&category=${JSON.stringify(categories)}` : ``}`
      );
    },
  });

  return {
    getAllListings,
  };
};
