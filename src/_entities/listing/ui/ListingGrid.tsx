import { Skeleton, cn } from '_shared';
import { Listing } from '../model';
import { ListingCard } from './ListingCard';

const gridClass =
  'grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5';

export const ListingGrid = ({
  listings,
  showStatus,
  className,
}: {
  listings: Listing[];
  showStatus?: boolean;
  className?: string;
}) => (
  <div className={cn(gridClass, className)}>
    {listings.map((l) => (
      <ListingCard key={l.id} listing={l} showStatus={showStatus} />
    ))}
  </div>
);

export const ListingGridSkeleton = ({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div className={cn(gridClass, className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className='overflow-hidden rounded-xl border bg-card'>
        <Skeleton className='aspect-[4/3] rounded-none' />
        <div className='space-y-2.5 p-4'>
          <Skeleton className='h-5 w-2/3' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      </div>
    ))}
  </div>
);
