import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '_app';
import { useGetFavorites, useGetMyListings } from '_entities/listing';
import { useGetSavedSearches } from '_entities/notification';

export const PROFILE_TABS = [
  'listings',
  'favorites',
  'searches',
  'settings',
] as const;
export type ProfileTab = (typeof PROFILE_TABS)[number];

export const useProfile = () => {
  const { user } = useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const tab: ProfileTab = (PROFILE_TABS as readonly string[]).includes(
    raw ?? ''
  )
    ? (raw as ProfileTab)
    : 'listings';
  const [page, setPage] = useState(1);
  const { getMyListings } = useGetMyListings(page);
  const { getFavorites } = useGetFavorites(tab === 'favorites');
  const { getSavedSearches } = useGetSavedSearches(tab === 'searches');

  return {
    me: user!,
    tab,
    setTab: (t: string) =>
      setSearchParams(t === 'listings' ? {} : { tab: t }, { replace: true }),
    myListings: getMyListings.data?.listings ?? [],
    myListingsTotal: getMyListings.data?.meta.total ?? 0,
    myListingsLoading: getMyListings.isLoading,
    totalPages: getMyListings.data?.meta.totalPages ?? 0,
    page,
    setPage,
    favorites: getFavorites.data ?? [],
    favoritesLoading: getFavorites.isLoading,
    savedSearches: getSavedSearches.data ?? [],
    savedSearchesLoading: getSavedSearches.isLoading,
  };
};
