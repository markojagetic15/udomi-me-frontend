import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BrowseFilters,
  EMPTY_FILTERS,
  filtersToSearchParams,
  parseFilters,
} from './filters';

// URL-backed filter state. Any filter change resets to page 1; page changes
// push history (so Back returns to the previous page), filter edits replace.
export const useBrowseFilters = (preserve: string[] = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const write = useCallback(
    (next: BrowseFilters, replace: boolean) => {
      const sp = filtersToSearchParams(next);
      preserve.forEach((k) => {
        const v = searchParams.get(k);
        if (v !== null) sp.set(k, v);
      });
      setSearchParams(sp, { replace });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams, preserve.join(',')]
  );

  const update = useCallback(
    (patch: Partial<BrowseFilters>) =>
      write({ ...filters, ...patch, page: 1 }, true),
    [filters, write]
  );

  const setPage = useCallback(
    (page: number) => {
      write({ ...filters, page }, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [filters, write]
  );

  const reset = useCallback(
    () => write({ ...EMPTY_FILTERS, q: filters.q, sort: filters.sort }, true),
    [filters, write]
  );

  return { filters, update, setPage, reset };
};
