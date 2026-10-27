import { useAxios } from '_app';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AppNotification } from '../model';

export const useGetNotifications = (page = 1, limit = 20, enabled = true) => {
  const { axios } = useAxios();
  const getNotifications = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async (): Promise<{
      notifications: AppNotification[];
      meta: { totalPages: number };
    }> => axios.get(`/notifications?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
    enabled,
  });
  return { getNotifications };
};

export const useUnreadNotificationsCount = (enabled: boolean) => {
  const { axios } = useAxios();
  const q = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async (): Promise<{ count: number }> =>
      axios.get('/notifications/unread-count'),
    enabled,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  return { unreadNotifications: q.data?.count ?? 0 };
};

export const useMarkNotificationsRead = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // No id = mark all read.
    mutationFn: (id?: string) =>
      axios.post(id ? `/notifications/${id}/read` : '/notifications/read-all'),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  return { markRead: mutation.mutate };
};
