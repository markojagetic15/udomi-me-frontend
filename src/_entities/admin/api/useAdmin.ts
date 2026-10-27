import { useAxios } from '_app';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import {
  AdminActionEntry,
  AdminListingDetail,
  AdminListingRow,
  AdminReport,
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AdminUserRow,
} from '../model';

type Page<K extends string, T> = { [k in K]: T[] } & {
  meta: { total: number; totalPages: number };
};
const qs = (o: Record<string, string | number>) =>
  new URLSearchParams(
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)]))
  );

export const useAdminStats = () => {
  const { axios } = useAxios();
  const getStats = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => axios.get('/admin/stats'),
  });
  return { getStats };
};

export const useAdminReports = (
  status: 'open' | 'resolved' | 'dismissed',
  page: number
) => {
  const { axios } = useAxios();
  const getReports = useQuery({
    queryKey: ['admin', 'reports', status, page],
    queryFn: async (): Promise<Page<'reports', AdminReport>> =>
      axios.get(`/admin/reports?${qs({ status, page, limit: 20 })}`),
    placeholderData: keepPreviousData,
  });
  return { getReports };
};

export const useAdminUsers = (search: string, filter: string, page: number) => {
  const { axios } = useAxios();
  const getUsers = useQuery({
    queryKey: ['admin', 'users', search, filter, page],
    queryFn: async (): Promise<Page<'users', AdminUserRow>> =>
      axios.get(`/admin/users?${qs({ search, filter, page, limit: 25 })}`),
    placeholderData: keepPreviousData,
  });
  return { getUsers };
};

export const useAdminUserDetail = (id: string | null) => {
  const { axios } = useAxios();
  const getUserDetail = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async (): Promise<AdminUserDetail> =>
      axios.get(`/admin/users/${id}`),
    enabled: !!id,
  });
  return { getUserDetail };
};

export const useAdminListings = (
  search: string,
  status: string,
  type: string,
  page: number
) => {
  const { axios } = useAxios();
  const getListings = useQuery({
    queryKey: ['admin', 'listings', search, status, type, page],
    queryFn: async (): Promise<Page<'listings', AdminListingRow>> =>
      axios.get(
        `/admin/listings?${qs({ search, status, type, page, limit: 25 })}`
      ),
    placeholderData: keepPreviousData,
  });
  return { getListings };
};

export const useAdminListingDetail = (id: string | null) => {
  const { axios } = useAxios();
  const getListingDetail = useQuery({
    queryKey: ['admin', 'listing', id],
    queryFn: async (): Promise<AdminListingDetail> =>
      axios.get(`/admin/listings/${id}`),
    enabled: !!id,
  });
  return { getListingDetail };
};

export const useAdminActivity = (page: number) => {
  const { axios } = useAxios();
  const getActivity = useQuery({
    queryKey: ['admin', 'activity', page],
    queryFn: async (): Promise<Page<'actions', AdminActionEntry>> =>
      axios.get(`/admin/activity?${qs({ page, limit: 30 })}`),
    placeholderData: keepPreviousData,
  });
  return { getActivity };
};

export const usePendingShelters = () => {
  const { axios } = useAxios();
  const getPendingShelters = useQuery({
    queryKey: ['admin', 'shelters'],
    queryFn: async (): Promise<AdminUser[]> =>
      axios.get('/admin/shelters/pending'),
  });
  return { getPendingShelters };
};

// All admin actions share invalidation (everything under ['admin']) + toast.
// `gone` names the detail query of something that was just deleted: it's
// skipped by the refetch (it would only 404); the panel also stops querying
// it (deletedId in UserSheet/ListingSheet).
const useAdminAction = <T>(
  fn: (arg: T) => Promise<unknown>,
  onSuccess?: () => void,
  gone?: (arg: T) => readonly unknown[]
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: fn,
    onSuccess: (_data, arg) => {
      const goneKey = gone?.(arg);
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ['admin'],
        predicate: (q) =>
          !goneKey || JSON.stringify(q.queryKey) !== JSON.stringify(goneKey),
      });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success(t('admin.done'));
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { run: mutation.mutate, isPending: mutation.isPending };
};

export const useResolveReport = () => {
  const { axios } = useAxios();
  return useAdminAction(
    ({
      id,
      action,
    }: {
      id: string;
      action: 'dismiss' | 'hide_listing' | 'ban_user';
    }) => axios.post(`/admin/reports/${id}/resolve`, { action })
  );
};

export const useSetUserBanned = () => {
  const { axios } = useAxios();
  return useAdminAction(({ id, banned }: { id: string; banned: boolean }) =>
    axios.post(`/admin/users/${id}/${banned ? 'ban' : 'unban'}`)
  );
};

export const useAdminDeleteUser = (onSuccess?: () => void) => {
  const { axios } = useAxios();
  return useAdminAction(
    ({ id, confirm_email }: { id: string; confirm_email: string }) =>
      axios.delete(`/admin/users/${id}`, { data: { confirm_email } }),
    onSuccess,
    ({ id }) => ['admin', 'user', id]
  );
};

export const useSetListingHidden = () => {
  const { axios } = useAxios();
  return useAdminAction(({ id, hidden }: { id: string; hidden: boolean }) =>
    axios.post(`/admin/listings/${id}/${hidden ? 'hide' : 'unhide'}`)
  );
};

export const useAdminDeleteListing = (onSuccess?: () => void) => {
  const { axios } = useAxios();
  return useAdminAction(
    (id: string) => axios.delete(`/admin/listings/${id}`),
    onSuccess,
    (id) => ['admin', 'listing', id]
  );
};

export const useReviewShelter = () => {
  const { axios } = useAxios();
  return useAdminAction(({ id, approve }: { id: string; approve: boolean }) =>
    axios.post(`/admin/shelters/${id}/review`, { approve })
  );
};

// Direct message to one user from the Udomi me team; resolves to the thread id.
export const useAdminMessageUser = (onSent?: (conversationId: string) => void) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }): Promise<{ conversation_id: string }> =>
      axios.post(`/admin/users/${id}/message`, { body }),
    onSuccess: ({ conversation_id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
      toast.success(t('admin.messageSent'));
      onSent?.(conversation_id);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { messageUser: mutation.mutate, isPending: mutation.isPending };
};

export type BroadcastAudience = 'all' | 'shelters' | 'posters';

export const useBroadcastCount = (audience: BroadcastAudience) => {
  const { axios } = useAxios();
  const getCount = useQuery({
    queryKey: ['admin', 'broadcast-count', audience],
    queryFn: async (): Promise<{ count: number }> => axios.get(`/admin/broadcast/count?audience=${audience}`),
  });
  return { recipients: getCount.data?.count, isLoading: getCount.isLoading };
};

export const useBroadcast = (onSent?: (sent: number) => void) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: { audience: BroadcastAudience; body: string }): Promise<{ sent: number }> =>
      axios.post('/admin/broadcast', dto),
    onSuccess: ({ sent }) => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success(t('admin.broadcastSent', { count: sent }));
      onSent?.(sent);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { broadcast: mutation.mutate, isPending: mutation.isPending };
};
