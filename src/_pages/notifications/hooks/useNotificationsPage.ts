import { useState } from 'react';
import {
  useGetNotifications,
  useMarkNotificationsRead,
} from '_entities/notification';

export const useNotificationsPage = () => {
  const [page, setPage] = useState(1);
  const { getNotifications } = useGetNotifications(page, 20);
  const { markRead } = useMarkNotificationsRead();
  const notifications = getNotifications.data?.notifications ?? [];
  return {
    notifications,
    isLoading: getNotifications.isLoading,
    totalPages: getNotifications.data?.meta.totalPages ?? 0,
    page,
    setPage,
    hasUnread: notifications.some((n) => !n.is_read),
    markRead,
  };
};
