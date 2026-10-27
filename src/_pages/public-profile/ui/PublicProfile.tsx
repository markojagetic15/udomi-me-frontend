import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin, Phone, Settings } from 'lucide-react';
import { ListingGrid, ListingGridSkeleton } from '_entities/listing';
import {
  isVerifiedShelter,
  publicName,
  ShelterBadge,
  UserAvatar,
} from '_entities/user';
import {
  Button,
  Card,
  EmptyState,
  formatDate,
  PageLoader,
  Pagination,
} from '_shared';
import { ErrorPage } from '_pages/error';
import { usePublicProfile } from '../hooks';

export const PublicProfile = () => {
  const { t } = useTranslation();
  const p = usePublicProfile();
  if (p.isLoading) return <PageLoader />;
  if (p.isError || !p.profile) return <ErrorPage code={404} />;
  const { user, stats } = p.profile;
  const shelter = isVerifiedShelter(user);
  const name = publicName(user);

  return (
    <div className='container py-8 sm:py-10'>
      <Card className='relative overflow-hidden'>
        <div className='bg-paws h-28 bg-gradient-to-r from-sage-200 to-sage-100 sm:h-36' />
        <div className='flex flex-col gap-5 p-5 pt-0 sm:flex-row sm:items-end sm:p-8 sm:pt-0'>
          <UserAvatar
            name={name}
            url={user.avatar_url}
            className='-mt-12 h-24 w-24 border-4 border-card text-2xl shadow-soft sm:h-28 sm:w-28'
          />
          <div className='flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-extrabold sm:text-3xl'>{name}</h1>
              {shelter && <ShelterBadge />}
            </div>
            <div className='mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground'>
              {user.shelter_city && (
                <span className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' /> {user.shelter_city}
                </span>
              )}
              <span>
                {t('detail.memberSince', { date: formatDate(user.created_at) })}
              </span>
            </div>
          </div>
          <div className='flex gap-6 text-center'>
            <div>
              <p className='font-display text-2xl font-black text-primary'>
                {stats.active_listings}
              </p>
              <p className='text-xs text-muted-foreground'>
                {t('profile.statActive')}
              </p>
            </div>
            <div>
              <p className='font-display text-2xl font-black text-primary'>
                {stats.adopted}
              </p>
              <p className='text-xs text-muted-foreground'>
                {t('profile.statAdopted')}
              </p>
            </div>
          </div>
          {p.isMe && (
            <Button variant='outline' asChild>
              <Link to='/profile?tab=settings'>
                <Settings /> {t('nav.settings')}
              </Link>
            </Button>
          )}
        </div>
        {shelter &&
          (user.shelter_description ||
            user.shelter_website ||
            user.shelter_phone) && (
            <div className='border-t px-5 py-5 sm:px-8'>
              {user.shelter_description && (
                <p className='max-w-3xl whitespace-pre-line text-foreground/85'>
                  {user.shelter_description}
                </p>
              )}
              <div className='mt-3 flex flex-wrap gap-4 text-sm'>
                {user.shelter_website && (
                  <a
                    href={user.shelter_website}
                    target='_blank'
                    rel='noopener noreferrer nofollow'
                    className='flex items-center gap-1.5 font-medium text-primary hover:underline'
                  >
                    <Globe className='h-4 w-4' />{' '}
                    {user.shelter_website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {user.shelter_phone && (
                  <a
                    href={`tel:${user.shelter_phone.replace(/\s/g, '')}`}
                    className='flex items-center gap-1.5 font-medium text-primary hover:underline'
                  >
                    <Phone className='h-4 w-4' /> {user.shelter_phone}
                  </a>
                )}
              </div>
            </div>
          )}
      </Card>

      <h2 className='mb-5 mt-10 text-2xl font-extrabold'>
        {t('profile.listingsOf', { name: user.first_name })}
      </h2>
      {p.listingsLoading ? (
        <ListingGridSkeleton count={4} />
      ) : p.listings.length ? (
        <>
          <ListingGrid listings={p.listings} />
          <Pagination
            page={p.page}
            totalPages={p.totalPages}
            onChange={p.setPage}
            className='mt-8'
          />
        </>
      ) : (
        <EmptyState
          icon={<span className='text-3xl'>🐾</span>}
          title={t('profile.noPublicListings')}
        />
      )}
    </div>
  );
};
