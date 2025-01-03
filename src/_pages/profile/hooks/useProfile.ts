import { useGetMyListings } from '_entities/listing';
import { useGlobalContext } from '_app';

export const useProfile = () => {
  const { getAllListings } = useGetMyListings();
  const { user } = useGlobalContext();

  const { data, isError, isLoading } = getAllListings;

  return {
    listings: data?.listings,
    isLoading,
    isError,
    user,
  };
};
