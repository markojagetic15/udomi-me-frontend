import { useTranslation } from 'react-i18next';
import { ChevronRight, Flag, LayoutGrid, Search } from 'lucide-react';
import { LISTING_STATUSES } from '_entities/admin';
import { categoryEmoji, firstImage } from '_entities/listing';
import {
  Card,
  cn,
  EmptyState,
  formatDate,
  Input,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '_shared';
import { usePetsTab } from '../hooks';
import { FilterChips, ListingStatusBadge } from './parts';

export const PetsTab = ({
  onOpenListing,
}: {
  onOpenListing: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const p = usePetsTab();
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 sm:flex-row'>
        <div className='relative flex-1 sm:max-w-md'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={p.search}
            onChange={(e) => p.setSearch(e.target.value)}
            placeholder={t('admin.searchPets')}
            className='pl-9'
          />
        </div>
        <Select value={p.type} onValueChange={p.setType}>
          <SelectTrigger
            className='sm:w-48'
            aria-label={t('listingForm.typeTitle')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('admin.allTypes')}</SelectItem>
            {(['adoption', 'lost', 'found'] as const).map((x) => (
              <SelectItem key={x} value={x}>
                {t(`listingType.${x}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FilterChips
        options={LISTING_STATUSES}
        value={p.status}
        onChange={p.setStatus}
        label={(s) => t(`admin.petStatus.${s}`)}
      />
      <p className='text-sm text-muted-foreground'>
        {t('browse.results', { count: p.total })}
      </p>

      {p.isLoading ? (
        <div className='flex flex-col gap-2'>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-16' />
          ))}
        </div>
      ) : p.listings.length === 0 ? (
        <EmptyState icon={<LayoutGrid />} title={t('admin.noPets')} />
      ) : (
        <Card className={cn('divide-y', p.isFetching && 'opacity-70')}>
          {p.listings.map((l) => (
            <button
              key={l.id}
              type='button'
              onClick={() => onOpenListing(l.id)}
              className='flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-secondary/50'
            >
              {firstImage(l) ? (
                <img
                  src={firstImage(l)!}
                  alt=''
                  className='h-12 w-12 shrink-0 rounded-lg object-cover'
                />
              ) : (
                <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl'>
                  {categoryEmoji(l.category)}
                </span>
              )}
              <span className='min-w-0 flex-1'>
                <span className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                  <span className='truncate font-semibold'>{l.title}</span>
                  <ListingStatusBadge l={l} />
                </span>
                <span className='block truncate text-sm text-muted-foreground'>
                  {t(`listingType.${l.listing_type}`)} ·{' '}
                  {l.user?.email ?? t('admin.deletedUser')}
                </span>
              </span>
              <span className='hidden shrink-0 items-center gap-4 text-sm text-muted-foreground sm:flex'>
                <span
                  className={cn(
                    'flex items-center gap-1',
                    l.open_reports > 0 && 'font-semibold text-destructive'
                  )}
                  title={t('admin.tabReports')}
                >
                  <Flag className='h-4 w-4' /> {l.open_reports}
                </span>
                <span className='w-24 text-right tabular-nums'>
                  {formatDate(l.created_at)}
                </span>
              </span>
              <ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
            </button>
          ))}
        </Card>
      )}
      <Pagination
        page={p.page}
        totalPages={p.totalPages}
        onChange={p.setPage}
      />
    </div>
  );
};
