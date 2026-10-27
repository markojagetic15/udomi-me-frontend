import { useState } from 'react';
import { useGetAdoptedListings } from '_entities/listing';

export const useStories = () => {
  const [page, setPage] = useState(1);
  const { getAdoptedListings } = useGetAdoptedListings(page, 12);
  return {
    stories: getAdoptedListings.data?.listings ?? [],
    totalPages: getAdoptedListings.data?.meta.totalPages ?? 0,
    total: getAdoptedListings.data?.meta.total ?? 0,
    isLoading: getAdoptedListings.isLoading,
    page,
    setPage: (p: number) => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
};
