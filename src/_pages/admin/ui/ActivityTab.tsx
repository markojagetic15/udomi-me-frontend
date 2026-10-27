import { useTranslation } from 'react-i18next';
import { History } from 'lucide-react';
import { AdminActionEntry } from '_entities/admin';
import { Card, EmptyState, formatDateTime, Pagination, Spinner } from '_shared';
import { useActivityTab } from '../hooks';

export const ActionRow = ({
  a,
  onOpen,
}: {
  a: AdminActionEntry;
  onOpen?: (a: AdminActionEntry) => void;
}) => {
  const { t } = useTranslation();
  const deleted =
    a.action === 'delete_user' ||
    a.action === 'delete_listing' ||
    a.target_type === 'broadcast';
  return (
    <div className='flex flex-col gap-0.5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-3'>
      <span className='shrink-0 text-xs tabular-nums text-muted-foreground sm:w-36'>
        {formatDateTime(a.created_at)}
      </span>
      <span className='min-w-0 flex-1'>
        <b>
          {a.admin
            ? `${a.admin.first_name} ${a.admin.last_name}`
            : t('admin.deletedUser')}
        </b>{' '}
        {t(`admin.actionLog.${a.action}`)}{' '}
        {onOpen && !deleted ? (
          <button
            type='button'
            className='font-medium text-primary hover:underline'
            onClick={() => onOpen(a)}
          >
            {a.target_label}
          </button>
        ) : (
          <span className='font-medium'>{a.target_label}</span>
        )}
      </span>
    </div>
  );
};

export const ActivityTab = ({
  onOpenUser,
  onOpenListing,
}: {
  onOpenUser: (id: string) => void;
  onOpenListing: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const p = useActivityTab();
  if (p.isLoading) return <Spinner />;
  if (!p.actions.length)
    return (
      <EmptyState
        icon={<History />}
        title={t('admin.noHistory')}
        description={t('admin.activityHint')}
      />
    );
  return (
    <>
      <p className='mb-4 text-sm text-muted-foreground'>
        {t('admin.activityHint')}
      </p>
      <Card className='divide-y'>
        {p.actions.map((a) => (
          <ActionRow
            key={a.id}
            a={a}
            onOpen={(x) =>
              x.target_type === 'user'
                ? onOpenUser(x.target_id)
                : x.target_type === 'listing'
                  ? onOpenListing(x.target_id)
                  : undefined
            }
          />
        ))}
      </Card>
      <Pagination
        page={p.page}
        totalPages={p.totalPages}
        onChange={p.setPage}
        className='mt-6'
      />
    </>
  );
};
