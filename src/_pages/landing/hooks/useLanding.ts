import { useGlobalContext } from '_app';
import { useGetAdoptedListings, useGetListings } from '_entities/listing';

export const useLanding = () => {
  const { isLoggedIn } = useGlobalContext();
  const { getListings } = useGetListings({
    type: 'adoption',
    page: '1',
    limit: '8',
    sort: 'newest',
  });
  const { getListings: getLost } = useGetListings({
    type: 'lost',
    page: '1',
    limit: '1',
  });
  const { getAdoptedListings } = useGetAdoptedListings(1, 3);

  const listings = getListings.data?.listings ?? [];
  return {
    isLoggedIn,
    listings,
    isLoading: getListings.isLoading,
    heroImages: listings
      .map((l) => [...l.images].sort((a, b) => a.position - b.position)[0]?.url)
      .filter(Boolean)
      .slice(0, 3) as string[],
    availableCount: getListings.data?.meta.total ?? 0,
    adoptedCount: getAdoptedListings.data?.meta.total ?? 0,
    lostCount: getLost.data?.meta.total ?? 0,
    stories: getAdoptedListings.data?.listings ?? [],
  };
};
