import { useFavoriteListing, useGetListing } from '_entities/listing';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../_app';

export const useAnimalInfo = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const { id } = useParams<{ id: string }>();

  const { user } = useGlobalContext();

  const { getListing } = useGetListing(id as string);

  const { favoriteListing, isPending } = useFavoriteListing();

  const { data, isError, isLoading } = getListing;

  const listing = data?.listing;

  useEffect(() => {
    if (user) {
      const favoriteListings = user?.favorite_listings || [];
      const favoriteListingsIds = favoriteListings.map((listing) => listing.id);
      setIsFavorited(favoriteListingsIds.includes(listing?.id as string));
    }
  }, [user]);

  const handleFavorite = () => {
    favoriteListing({ id: listing?.id as string });
    setIsFavorited(!isFavorited);
  };

  const handleShowInterest = () => {};

  return {
    id,
    listing,
    isError,
    isLoading,
    isFavoritePending: isPending,
    handleFavorite,
    isFavorited,
  };
};
