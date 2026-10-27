import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalContext } from '_app';
import {
  useGetListing,
  useGetListings,
  useShowInterest,
} from '_entities/listing';
import { geocodeAddress } from '_shared';

export const useListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useGlobalContext();
  const { getListing } = useGetListing(id);
  const listing = getListing.data?.listing;
  const { showInterest, isPending: isInterestPending } = useShowInterest();
  const [reportOpen, setReportOpen] = useState(false);
  const [phoneShown, setPhoneShown] = useState(false);
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);

  // Older listings may lack coordinates — geocode the address once.
  useEffect(() => {
    if (!listing) return;
    if (listing.lat != null && listing.lng != null)
      setPoint({ lat: listing.lat, lng: listing.lng });
    else if (listing.address)
      geocodeAddress(listing.address)
        .then(setPoint)
        .catch(() => undefined);
  }, [listing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const similarParams = useMemo(
    () => ({
      type: listing?.listing_type ?? 'adoption',
      category: listing?.category ?? '',
      page: '1',
      limit: '5',
    }),
    [listing?.listing_type, listing?.category]
  );
  const { getListings: getSimilar } = useGetListings(similarParams);
  const similar = (getSimilar.data?.listings ?? [])
    .filter((l) => l.id !== listing?.id)
    .slice(0, 4);

  const isOwner = !!user && !!listing && listing.user?.id === user.id;
  const isInterested =
    !!listing && !!user?.interested_listings?.some((l) => l.id === listing.id);

  return {
    listing,
    isLoading: getListing.isLoading,
    isError: getListing.isError,
    isOwner,
    isAdmin,
    isLoggedIn: !!user,
    isInterested,
    isInterestPending,
    toggleInterest: () => {
      if (!user)
        return navigate(`/login?next=${encodeURIComponent(`/animal/${id}`)}`);
      if (listing) showInterest(listing.id);
    },
    reportOpen,
    setReportOpen,
    openReport: () =>
      user
        ? setReportOpen(true)
        : navigate(`/login?next=${encodeURIComponent(`/animal/${id}`)}`),
    phoneShown,
    showPhone: () => setPhoneShown(true),
    point,
    similar,
    goBack: () =>
      window.history.length > 1 ? navigate(-1) : navigate('/browse'),
  };
};
