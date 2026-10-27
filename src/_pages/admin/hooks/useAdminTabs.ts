import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  ListingStatusFilter,
  useAdminActivity,
  useAdminListings,
  useAdminReports,
  useAdminUsers,
  UserFilter,
  usePendingShelters,
  useResolveReport,
  useReviewShelter,
} from '_entities/admin';

export const useUsersTab = () => {
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search, 350);
  const [filter, setFilter] = useState<UserFilter>('all');
  const [page, setPage] = useState(1);
  const { getUsers } = useAdminUsers(debounced, filter, page);
  return {
    search,
    setSearch: (s: string) => {
      setSearch(s);
      setPage(1);
    },
    filter,
    setFilter: (f: UserFilter) => {
      setFilter(f);
      setPage(1);
    },
    page,
    setPage,
    users: getUsers.data?.users ?? [],
    total: getUsers.data?.meta.total ?? 0,
    totalPages: getUsers.data?.meta.totalPages ?? 0,
    isLoading: getUsers.isLoading,
    isFetching: getUsers.isFetching,
  };
};

export const usePetsTab = () => {
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search, 350);
  const [status, setStatus] = useState<ListingStatusFilter>('all');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const { getListings } = useAdminListings(debounced, status, type, page);
  const reset =
    <T>(fn: (v: T) => void) =>
    (v: T) => {
      fn(v);
      setPage(1);
    };
  return {
    search,
    setSearch: reset(setSearch),
    status,
    setStatus: reset(setStatus),
    type,
    setType: reset(setType),
    page,
    setPage,
    listings: getListings.data?.listings ?? [],
    total: getListings.data?.meta.total ?? 0,
    totalPages: getListings.data?.meta.totalPages ?? 0,
    isLoading: getListings.isLoading,
    isFetching: getListings.isFetching,
  };
};

export const useReportsTab = () => {
  const [status, setStatus] = useState<'open' | 'resolved' | 'dismissed'>(
    'open'
  );
  const [page, setPage] = useState(1);
  const { getReports } = useAdminReports(status, page);
  const resolve = useResolveReport();
  return {
    status,
    setStatus: (s: 'open' | 'resolved' | 'dismissed') => {
      setStatus(s);
      setPage(1);
    },
    page,
    setPage,
    reports: getReports.data?.reports ?? [],
    totalPages: getReports.data?.meta.totalPages ?? 0,
    isLoading: getReports.isLoading,
    resolveReport: resolve.run,
    resolving: resolve.isPending,
  };
};

export const useSheltersTab = () => {
  const { getPendingShelters } = usePendingShelters();
  const review = useReviewShelter();
  return {
    shelters: getPendingShelters.data ?? [],
    isLoading: getPendingShelters.isLoading,
    reviewShelter: review.run,
    reviewing: review.isPending,
  };
};

export const useActivityTab = () => {
  const [page, setPage] = useState(1);
  const { getActivity } = useAdminActivity(page);
  return {
    page,
    setPage,
    actions: getActivity.data?.actions ?? [],
    totalPages: getActivity.data?.meta.totalPages ?? 0,
    isLoading: getActivity.isLoading,
  };
};
