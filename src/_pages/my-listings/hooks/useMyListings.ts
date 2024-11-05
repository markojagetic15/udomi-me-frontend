import { useGetMyListings } from '_features/listing';

export const useMyListings = () => {
  const { getAllListings } = useGetMyListings();

  const { data, isError, isLoading } = getAllListings;

  return {
    listings: data?.listings,
    isLoading,
  };
};
