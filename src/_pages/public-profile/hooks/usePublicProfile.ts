import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalContext } from '_app';
import { useGetPublicProfile, useGetUserListings } from '_entities/user';

export const usePublicProfile = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useGlobalContext();
  const [page, setPage] = useState(1);
  const { getPublicProfile } = useGetPublicProfile(id);
  const { getUserListings } = useGetUserListings(id, page);
  return {
    profile: getPublicProfile.data,
    isLoading: getPublicProfile.isLoading,
    isError: getPublicProfile.isError,
    listings: getUserListings.data?.listings ?? [],
    listingsLoading: getUserListings.isLoading,
    totalPages: getUserListings.data?.meta.totalPages ?? 0,
    page,
    setPage,
    isMe: user?.id === id,
  };
};
