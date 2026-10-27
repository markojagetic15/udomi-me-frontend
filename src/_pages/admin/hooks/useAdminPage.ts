import { useSearchParams } from 'react-router-dom';
import { useAdminStats } from '_entities/admin';

export const ADMIN_TABS = [
  'overview',
  'reports',
  'pets',
  'users',
  'shelters',
  'messages',
  'activity',
] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

// Tab + open detail panel live in the URL (?tab=users&user=<id>) so a
// refresh or a shared link reopens the same view.
export const useAdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab') ?? 'overview';
  const tab = (
    (ADMIN_TABS as readonly string[]).includes(raw) ? raw : 'overview'
  ) as AdminTab;
  const { getStats } = useAdminStats();

  const setParam = (key: string, value: string | null) =>
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (value) p.set(key, value);
        else p.delete(key);
        return p;
      },
      { replace: true }
    );

  return {
    tab,
    setTab: (t: string) =>
      setSearchParams(t === 'overview' ? {} : { tab: t }, { replace: true }),
    stats: getStats.data,
    openUserId: searchParams.get('user'),
    openListingId: searchParams.get('pet'),
    openUser: (id: string | null) => setParam('user', id),
    openListing: (id: string | null) => setParam('pet', id),
    // Jump between panels in ONE URL update (two setParam calls in a row
    // would each start from the same snapshot and the first would be lost).
    switchPanel: (kind: 'user' | 'pet', id: string) =>
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.delete(kind === 'user' ? 'pet' : 'user');
          p.set(kind, id);
          return p;
        },
        { replace: true }
      ),
  };
};
