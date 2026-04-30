import {
  useFavoriteListing,
  useGetListing,
  useShowInterest,
} from '_entities/listing';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../_app';

export const useAnimalInfo = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { user } = useGlobalContext();

  const { getListing } = useGetListing(id as string);
  const { favoriteListing, isPending: isFavoritePending } = useFavoriteListing();
  const { showInterest, isPending: isInterestPending } = useShowInterest();

  const { data, isError, isLoading } = getListing;
  const listing = data?.listing;

  useEffect(() => {
    if (user && listing) {
      setIsFavorited(
        (user.favorite_listings || []).some((l) => l.id === listing.id),
      );
      setIsInterested(
        (user.interested_listings || []).some((l) => l.id === listing.id),
      );
    }
  }, [user, listing]);

  const handleFavorite = () => {
    favoriteListing({ id: listing?.id as string });
    setIsFavorited((prev) => !prev);
  };

  const handleShowInterest = () => {
    showInterest({ id: listing?.id as string });
    setIsInterested((prev) => !prev);
  };

  const isOwner = !!(user && listing?.user?.id === user.id);

  return {
    id,
    listing,
    isError,
    isLoading,
    isFavoritePending,
    isInterestPending,
    handleFavorite,
    handleShowInterest,
    isFavorited,
    isInterested,
    isOwner,
  };
};
