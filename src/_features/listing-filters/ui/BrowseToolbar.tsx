import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '_shared';
import { activeFilterCount, BrowseFilters, Sort, SORTS } from '../model';
import { FilterPanel } from './FilterPanel';

export const BrowseToolbar = ({
  filters,
  update,
  reset,
  total,
  variant = 'adoption',
  extra,
}: {
  filters: BrowseFilters;
  update: (patch: Partial<BrowseFilters>) => void;
  reset: () => void;
  total?: number;
  variant?: 'adoption' | 'lostFound';
  extra?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const [q, setQ] = React.useState(filters.q);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setQ(filters.q);
  }, [filters.q]);
  const pushQ = useDebouncedCallback((v: string) => update({ q: v }), 400);
  const count = activeFilterCount(filters);
  const hasPoint = filters.lat !== null;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              pushQ(e.target.value);
            }}
            placeholder={t('browse.searchPlaceholder')}
            className='h-11 pl-10'
            aria-label={t('browse.searchPlaceholder')}
          />
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='h-11 flex-1 lg:hidden'
            onClick={() => setOpen(true)}
          >
            <SlidersHorizontal />
            {t('filters.title')}
            {count > 0 && (
              <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground'>
                {count}
              </span>
            )}
          </Button>
          <Select
            value={filters.sort}
            onValueChange={(v) => update({ sort: v as Sort })}
          >
            <SelectTrigger
              className='h-11 w-auto min-w-[10.5rem] flex-1 sm:flex-none'
              aria-label={t('browse.sort')}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align='end'>
              {SORTS.filter(
                (s) => variant === 'adoption' || s !== 'urgent'
              ).map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  disabled={s === 'nearest' && !hasPoint}
                >
                  {t(`browse.sortBy.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {extra}
        </div>
      </div>
      {total !== undefined && (
        <p className='text-sm text-muted-foreground' aria-live='polite'>
          {t('browse.results', { count: total })}
        </p>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='bottom' className='overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>{t('filters.title')}</SheetTitle>
          </SheetHeader>
          <FilterPanel
            filters={filters}
            update={update}
            reset={reset}
            variant={variant}
          />
          <Button
            className='sticky bottom-0 mt-2'
            size='lg'
            onClick={() => setOpen(false)}
          >
            {t('filters.showResults', { count: total ?? 0 })}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};
