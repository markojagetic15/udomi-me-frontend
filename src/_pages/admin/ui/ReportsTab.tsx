import { useTranslation } from 'react-i18next';
import { Ban, Check, EyeOff, X } from 'lucide-react';
import { firstImage } from '_entities/listing';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  formatDateTime,
  Pagination,
  Skeleton,
} from '_shared';
import { useReportsTab } from '../hooks';
import { FilterChips } from './parts';

export const ReportsTab = ({
  onOpenUser,
  onOpenListing,
}: {
  onOpenUser: (id: string) => void;
  onOpenListing: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const p = useReportsTab();
  return (
    <div className='flex flex-col gap-4'>
      <FilterChips
        options={['open', 'resolved', 'dismissed'] as const}
        value={p.status}
        onChange={p.setStatus}
        label={(s) => t(`admin.reportStatus.${s}`)}
      />
      {p.isLoading ? (
        <div className='grid gap-3'>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      ) : p.reports.length === 0 ? (
        <EmptyState icon={<Check />} title={t('admin.noReports')} />
      ) : (
        <div className='grid gap-3'>
          {p.reports.map((r) => (
            <Card key={r.id} className='flex flex-col gap-4 p-4 sm:flex-row'>
              {r.listing && (
                <button
                  type='button'
                  className='shrink-0'
                  onClick={() => onOpenListing(r.listing!.id)}
                >
                  {firstImage(r.listing) ? (
                    <img
                      src={firstImage(r.listing)!}
                      alt=''
                      className='h-24 w-full rounded-lg object-cover sm:w-32'
                    />
                  ) : (
                    <div className='h-24 w-full rounded-lg bg-muted sm:w-32' />
                  )}
                </button>
              )}
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Badge variant='destructive'>
                    {t(`report.reason.${r.reason}`)}
                  </Badge>
                  {r.listing?.is_hidden && (
                    <Badge variant='outline'>
                      {t('listing.hiddenByAdmin')}
                    </Badge>
                  )}
                  <span className='text-xs text-muted-foreground'>
                    {formatDateTime(r.created_at)}
                  </span>
                </div>
                {r.listing && (
                  <button
                    type='button'
                    onClick={() => onOpenListing(r.listing!.id)}
                    className='mt-1.5 block font-semibold hover:underline'
                  >
                    {r.listing.title}
                  </button>
                )}
                <p className='text-sm text-muted-foreground'>
                  {t('admin.owner')}:{' '}
                  {r.listing?.user ? (
                    <button
                      type='button'
                      className='hover:underline'
                      onClick={() => onOpenUser(r.listing!.user!.id)}
                    >
                      {r.listing.user.email}
                    </button>
                  ) : (
                    t('admin.deletedUser')
                  )}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {t('admin.reporter')}:{' '}
                  {r.reporter ? (
                    <button
                      type='button'
                      className='hover:underline'
                      onClick={() => onOpenUser(r.reporter!.id)}
                    >
                      {r.reporter.email}
                    </button>
                  ) : (
                    t('admin.deletedUser')
                  )}
                </p>
                {r.details && (
                  <p className='mt-2 rounded-lg bg-muted p-3 text-sm'>
                    “{r.details}”
                  </p>
                )}
                {r.status !== 'open' && r.action && (
                  <p className='mt-2 text-xs text-muted-foreground'>
                    {t(`admin.action.${r.action}`)}
                  </p>
                )}
              </div>
              {r.status === 'open' && (
                <div className='flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col'>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={p.resolving}
                    onClick={() =>
                      p.resolveReport({ id: r.id, action: 'dismiss' })
                    }
                  >
                    <X /> {t('admin.dismiss')}
                  </Button>
                  <Button
                    size='sm'
                    variant='secondary'
                    disabled={p.resolving}
                    onClick={() =>
                      p.resolveReport({ id: r.id, action: 'hide_listing' })
                    }
                  >
                    <EyeOff /> {t('admin.hideListing')}
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    disabled={p.resolving}
                    onClick={() =>
                      p.resolveReport({ id: r.id, action: 'ban_user' })
                    }
                  >
                    <Ban /> {t('admin.banOwner')}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Pagination
        page={p.page}
        totalPages={p.totalPages}
        onChange={p.setPage}
      />
    </div>
  );
};
