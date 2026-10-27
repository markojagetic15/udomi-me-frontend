import { useTranslation } from 'react-i18next';
import { ChevronRight, Flag, LayoutGrid, Search, Users } from 'lucide-react';
import { USER_FILTERS } from '_entities/admin';
import { UserAvatar } from '_entities/user';
import {
  Card,
  cn,
  EmptyState,
  formatDate,
  Input,
  Pagination,
  Skeleton,
} from '_shared';
import { useUsersTab } from '../hooks';
import { FilterChips, UserBadges } from './parts';

export const UsersTab = ({
  onOpenUser,
}: {
  onOpenUser: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const p = useUsersTab();
  return (
    <div className='flex flex-col gap-4'>
      <div className='relative max-w-md'>
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={p.search}
          onChange={(e) => p.setSearch(e.target.value)}
          placeholder={t('admin.searchUsers')}
          className='pl-9'
        />
      </div>
      <FilterChips
        options={USER_FILTERS}
        value={p.filter}
        onChange={p.setFilter}
        label={(f) => t(`admin.userFilter.${f}`)}
      />
      <p className='text-sm text-muted-foreground'>
        {t('admin.usersCount', { count: p.total })}
      </p>

      {p.isLoading ? (
        <div className='flex flex-col gap-2'>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-16' />
          ))}
        </div>
      ) : p.users.length === 0 ? (
        <EmptyState icon={<Users />} title={t('admin.noUsers')} />
      ) : (
        <Card className={cn('divide-y', p.isFetching && 'opacity-70')}>
          {p.users.map((u) => (
            <button
              key={u.id}
              type='button'
              onClick={() => onOpenUser(u.id)}
              className='flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-secondary/50'
            >
              <UserAvatar
                name={`${u.first_name} ${u.last_name}`}
                url={u.avatar_url}
              />
              <span className='min-w-0 flex-1'>
                <span className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                  <span className='truncate font-semibold'>
                    {u.first_name} {u.last_name}
                  </span>
                  <UserBadges u={u} />
                </span>
                <span className='block truncate text-sm text-muted-foreground'>
                  {u.email}
                </span>
              </span>
              <span className='hidden shrink-0 items-center gap-4 text-sm text-muted-foreground sm:flex'>
                <span
                  className='flex items-center gap-1'
                  title={t('admin.userPets')}
                >
                  <LayoutGrid className='h-4 w-4' /> {u.listings_count}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1',
                    u.open_reports > 0 && 'font-semibold text-destructive'
                  )}
                  title={t('admin.reportsAgainst')}
                >
                  <Flag className='h-4 w-4' /> {u.open_reports}
                </span>
                <span className='w-24 text-right tabular-nums'>
                  {formatDate(u.created_at)}
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
