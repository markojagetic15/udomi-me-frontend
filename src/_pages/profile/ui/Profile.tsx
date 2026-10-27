import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  ExternalLink,
  Heart,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';
import { ListingGrid, ListingGridSkeleton } from '_entities/listing';
import { useDeleteSavedSearch } from '_entities/notification';
import { isVerifiedShelter, ShelterBadge, UserAvatar } from '_entities/user';
import { savedFiltersToUrl } from '_features/listing-filters';
import {
  Button,
  Card,
  EmptyState,
  formatDate,
  Pagination,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '_shared';
import { useProfile } from '../hooks';
import { SettingsTab } from './SettingsTab';

export const Profile = () => {
  const { t } = useTranslation();
  const p = useProfile();
  const { deleteSavedSearch } = useDeleteSavedSearch();
  const name = `${p.me.first_name} ${p.me.last_name}`;

  return (
    <div className='container py-8 sm:py-10'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4'>
          <UserAvatar
            name={name}
            url={p.me.avatar_url}
            className='h-16 w-16 text-lg'
          />
          <div>
            <h1 className='flex flex-wrap items-center gap-2 text-2xl font-extrabold sm:text-3xl'>
              {isVerifiedShelter(p.me) && p.me.shelter_name
                ? p.me.shelter_name
                : name}
              {isVerifiedShelter(p.me) && <ShelterBadge />}
            </h1>
            <Link
              to={`/users/${p.me.id}`}
              className='inline-flex items-center gap-1 text-sm text-primary hover:underline'
            >
              {t('profile.viewPublic')} <ExternalLink className='h-3.5 w-3.5' />
            </Link>
          </div>
        </div>
        <Button asChild>
          <Link to='/create-listing'>
            <Plus /> {t('nav.createListing')}
          </Link>
        </Button>
      </div>

      <Tabs value={p.tab} onValueChange={p.setTab}>
        <TabsList className='w-full justify-start sm:w-auto'>
          <TabsTrigger value='listings'>
            <LayoutGrid /> {t('profile.tabListings')}
          </TabsTrigger>
          <TabsTrigger value='favorites'>
            <Heart /> {t('profile.tabFavorites')}
          </TabsTrigger>
          <TabsTrigger value='searches'>
            <Bell /> {t('profile.tabSearches')}
          </TabsTrigger>
          <TabsTrigger value='settings'>
            <Settings /> {t('profile.tabSettings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='listings'>
          {p.myListingsLoading ? (
            <ListingGridSkeleton count={4} />
          ) : p.myListings.length ? (
            <>
              <p className='mb-4 text-sm text-muted-foreground'>
                {t('profile.listingsCount', { count: p.myListingsTotal })}
              </p>
              <ListingGrid listings={p.myListings} showStatus />
              <Pagination
                page={p.page}
                totalPages={p.totalPages}
                onChange={p.setPage}
                className='mt-8'
              />
            </>
          ) : (
            <EmptyState
              icon={<LayoutGrid />}
              title={t('profile.noListings')}
              description={t('profile.noListingsText')}
              action={
                <Button asChild>
                  <Link to='/create-listing'>{t('nav.createListing')}</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value='favorites'>
          {p.favoritesLoading ? (
            <ListingGridSkeleton count={4} />
          ) : p.favorites.length ? (
            <ListingGrid listings={p.favorites} showStatus />
          ) : (
            <EmptyState
              icon={<Heart />}
              title={t('profile.noFavorites')}
              description={t('profile.noFavoritesText')}
              action={
                <Button asChild>
                  <Link to='/browse'>{t('landing.ctaBrowse')}</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value='searches'>
          {p.savedSearchesLoading ? (
            <div className='grid gap-3'>
              {[0, 1].map((i) => (
                <Skeleton key={i} className='h-20' />
              ))}
            </div>
          ) : p.savedSearches.length ? (
            <div className='grid gap-3 md:grid-cols-2'>
              {p.savedSearches.map((s) => (
                <Card key={s.id} className='flex items-center gap-4 p-4'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary'>
                    <Bell className='h-5 w-5' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-semibold'>{s.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {t('savedSearch.since', {
                        date: formatDate(s.created_at),
                      })}
                    </p>
                  </div>
                  <Button variant='outline' size='sm' asChild>
                    <Link to={savedFiltersToUrl(s.filters)}>
                      <Search /> {t('savedSearch.open')}
                    </Link>
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => deleteSavedSearch(s.id)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 />
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bell />}
              title={t('savedSearch.emptyTitle')}
              description={t('savedSearch.emptyText')}
              action={
                <Button asChild>
                  <Link to='/browse'>{t('landing.ctaBrowse')}</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value='settings'>
          <SettingsTab me={p.me} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
