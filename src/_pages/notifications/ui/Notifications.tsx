import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationRow } from '_widgets';
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  PageLoader,
  Pagination,
} from '_shared';
import { useNotificationsPage } from '../hooks';

export const Notifications = () => {
  const { t } = useTranslation();
  const p = useNotificationsPage();
  return (
    <div className='container max-w-2xl py-8 sm:py-10'>
      <PageHeader
        title={t('nav.notifications')}
        actions={
          p.hasUnread && (
            <Button variant='outline' onClick={() => p.markRead(undefined)}>
              <CheckCheck /> {t('notifications.markAllRead')}
            </Button>
          )
        }
      />
      {p.isLoading ? (
        <PageLoader />
      ) : p.notifications.length === 0 ? (
        <EmptyState
          icon={<Bell />}
          title={t('notifications.empty')}
          description={t('notifications.emptyText')}
        />
      ) : (
        <Card className='p-2'>
          {p.notifications.map((n) => (
            <NotificationRow
              key={n.id}
              n={n}
              onClick={() => !n.is_read && p.markRead(n.id)}
            />
          ))}
        </Card>
      )}
      <Pagination
        page={p.page}
        totalPages={p.totalPages}
        onChange={p.setPage}
        className='mt-6'
      />
    </div>
  );
};
