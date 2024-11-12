import { useGetListing } from '_features/listing';
import { useParams } from 'react-router-dom';

export const useAnimalInfo = () => {
  const { id } = useParams<{ id: string }>();

  const { getListing } = useGetListing(id as string);

  const { data, isError, isLoading } = getListing;

  const listing = data?.listing;

  return {
    id,
    listing,
    isError,
    isLoading,
  };
};
