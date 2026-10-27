import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin } from 'lucide-react';
import { useGlobalContext } from '_app';
import { Badge, cn, formatAge, formatDate, formatPrice } from '_shared';
import { isVerifiedShelter, ShelterBadge } from '../../user';
import { categoryEmoji, firstImage, Listing } from '../model';
import { FavoriteButton } from './FavoriteButton';

export const ListingCard = ({
  listing,
  showStatus,
}: {
  listing: Listing;
  showStatus?: boolean;
}) => {
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const isOwner = !!user && listing.user?.id === user.id;
  const image = firstImage(listing);
  const isLostFound = listing.listing_type !== 'adoption';
  const age = formatAge(listing.date_of_birth, t);
  const price = formatPrice(listing.adoption_fee, t);
  const place =
    listing.city ||
    listing.address?.split(',').slice(-2, -1)[0]?.trim() ||
    listing.address;

  return (
    <Link
      to={`/animal/${listing.id}`}
      className='group flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
        {image ? (
          <img
            src={image}
            alt={listing.title}
            loading='lazy'
            className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-5xl'>
            {categoryEmoji(listing.category)}
          </div>
        )}
        <div className='absolute left-2.5 top-2.5 flex flex-wrap gap-1.5'>
          {isLostFound && (
            <Badge
              variant={listing.listing_type === 'lost' ? 'urgent' : 'default'}
            >
              {t(`listingType.${listing.listing_type}`)}
            </Badge>
          )}
          {!isLostFound && listing.is_urgent && (
            <Badge variant='urgent'>{t('listing.urgent')}</Badge>
          )}
          {showStatus && listing.is_adopted && (
            <Badge variant='success'>
              {isLostFound ? t('listing.reunited') : t('listing.adopted')}
            </Badge>
          )}
          {showStatus && !listing.is_adopted && listing.is_active === false && (
            <Badge variant='glass'>{t('listing.paused')}</Badge>
          )}
          {showStatus && listing.is_hidden && (
            <Badge variant='destructive'>{t('listing.hiddenByAdmin')}</Badge>
          )}
        </div>
        {!isOwner && (
          <FavoriteButton
            listing={listing}
            className='absolute right-2.5 top-2.5'
          />
        )}
      </div>

      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='line-clamp-1 font-display text-lg font-bold leading-snug'>
            <span className='mr-1.5' aria-hidden>
              {categoryEmoji(listing.category)}
            </span>
            {listing.title}
          </h3>
          {listing.gender === 'male' ? (
            <span
              className='mt-0.5 shrink-0 text-lg font-bold leading-none text-sky-600'
              role='img'
              aria-label={t('gender.male')}
            >
              ♂
            </span>
          ) : listing.gender === 'female' ? (
            <span
              className='mt-0.5 shrink-0 text-lg font-bold leading-none text-pink-600'
              role='img'
              aria-label={t('gender.female')}
            >
              ♀
            </span>
          ) : null}
        </div>

        <div className='flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground'>
          {!isLostFound && age && <span>{age}</span>}
          {isLostFound && listing.event_date && (
            <span className='flex items-center gap-1'>
              <Clock className='h-3.5 w-3.5' /> {formatDate(listing.event_date)}
            </span>
          )}
          {listing.breed && (
            <span className='line-clamp-1'>{listing.breed}</span>
          )}
        </div>

        <div
          className={cn(
            'mt-auto flex items-center justify-between gap-2 pt-1 text-sm'
          )}
        >
          <span className='flex min-w-0 items-center gap-1 text-muted-foreground'>
            {place && (
              <>
                <MapPin className='h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>{place}</span>
              </>
            )}
          </span>
          {isVerifiedShelter(listing.user) ? (
            <ShelterBadge compact />
          ) : (
            !isLostFound &&
            price && (
              <span className='shrink-0 font-semibold text-primary'>
                {price}
              </span>
            )
          )}
        </div>
      </div>
    </Link>
  );
};
