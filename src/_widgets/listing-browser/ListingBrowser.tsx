import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchX } from 'lucide-react';
import {
  ListingGrid,
  ListingGridSkeleton,
  ListingType,
  useGetListings,
} from '_entities/listing';
import {
  ActiveFilters,
  BrowseToolbar,
  FilterPanel,
  SaveSearchButton,
  toApiParams,
  useBrowseFilters,
} from '_features/listing-filters';
import { Button, Card, EmptyState, Pagination } from '_shared';

const PAGE_SIZE = 12;

// Filterable, paginated listing grid; all state in the URL. Used by /browse
// and /lost-found (which keeps its own ?type= param).
export const ListingBrowser = ({
  type,
  variant,
  preserve,
}: {
  type: ListingType;
  variant: 'adoption' | 'lostFound';
  preserve?: string[];
}) => {
  const { t } = useTranslation();
  const { filters, update, setPage, reset } = useBrowseFilters(preserve);
  const params = React.useMemo(
    () => toApiParams(filters, type, PAGE_SIZE),
    [filters, type]
  );
  const { getListings } = useGetListings(params);
  const { data, isLoading, isError, isFetching, refetch } = getListings;

  return (
    <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
      <aside className='hidden lg:block'>
        <Card className='sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto p-5'>
          <FilterPanel
            filters={filters}
            update={update}
            reset={reset}
            variant={variant}
          />
        </Card>
      </aside>

      <div className='flex min-w-0 flex-col gap-5'>
        <BrowseToolbar
          filters={filters}
          update={update}
          reset={reset}
          total={data?.meta.total}
          variant={variant}
          extra={<SaveSearchButton filters={filters} type={type} />}
        />
        <ActiveFilters filters={filters} update={update} />

        {isError ? (
          <EmptyState
            icon={<SearchX />}
            title={t('browse.errorTitle')}
            description={t('browse.errorText')}
            action={
              <Button onClick={() => refetch()}>{t('common.retry')}</Button>
            }
          />
        ) : isLoading ? (
          <ListingGridSkeleton
            count={PAGE_SIZE}
            className='lg:grid-cols-2 xl:grid-cols-3'
          />
        ) : data && data.listings.length > 0 ? (
          <>
            <ListingGrid
              listings={data.listings}
              className={`lg:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-70 transition-opacity' : ''}`}
            />
            <Pagination
              page={filters.page}
              totalPages={data.meta.totalPages}
              onChange={setPage}
              className='mt-4'
            />
          </>
        ) : (
          <EmptyState
            icon={<span className='text-3xl'>🐾</span>}
            title={t('browse.emptyTitle')}
            description={t('browse.emptyText')}
            action={
              <div className='flex flex-wrap justify-center gap-2'>
                <Button variant='outline' onClick={reset}>
                  {t('filters.reset')}
                </Button>
                <SaveSearchButton filters={filters} type={type} />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};
