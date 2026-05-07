import { Listing } from '../model';
import { useNavigate } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useFavoriteListing } from '../api';
import { useGlobalContext } from '_app';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const categoryColors: Record<string, string> = {
  dog: 'bg-amber-100 text-amber-700',
  cat: 'bg-orange-100 text-orange-700',
  rabbit: 'bg-pink-100 text-pink-700',
  bird: 'bg-emerald-100 text-emerald-700',
  reptile: 'bg-lime-100 text-lime-700',
  horse: 'bg-yellow-100 text-yellow-700',
  other: 'bg-blue-100 text-blue-700',
};

function formatAge(dateOfBirth?: Date, t?: (key: string, opts?: any) => string): string | null {
  if (!dateOfBirth) return null;
  const months = dayjs().diff(dayjs(dateOfBirth), 'month');
  if (months < 1) return t ? t('listing.newborn') : 'Newborn';
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 yr' : `${years} yrs`;
}

export const ListingItem = ({ listing }: { listing: Listing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { favoriteListing } = useFavoriteListing();
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info(t('listing.loginToFavourite'));
      navigate('/login');
      return;
    }
    setIsFavorite((prev) => !prev);
    favoriteListing({ id: listing.id });
  };

  useEffect(() => {
    const ids = (user?.favorite_listings || []).map((l) => l.id);
    setIsFavorite(ids.includes(listing.id));
  }, [user]);

  const age = formatAge(listing.date_of_birth, t);
  const categoryColor = listing.category ? (categoryColors[listing.category] ?? 'bg-gray-100 text-gray-700') : null;

  return (
    <div
      className='group relative cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/80'
      onClick={() => navigate(`/animal/${listing.id}`)}
    >
      {/* Image */}
      <div className='relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
        {listing.images?.[0]?.url ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-5xl opacity-30'>🐾</span>
          </div>
        )}

        {/* Gradient overlay at bottom for readability */}
        {listing.images?.[0]?.url && (
          <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent' />
        )}

        {/* Badges */}
        <div className='absolute top-2.5 left-2.5 flex flex-col gap-1'>
          {listing.category && categoryColor && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${categoryColor} shadow-sm`}>
              {t(`categories.${listing.category}`).toUpperCase()}
            </span>
          )}
          {listing.is_urgent && (
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shadow-sm'>
              {t('animalInfo.urgent').toUpperCase()}
            </span>
          )}
        </div>

        {/* Favourite button */}
        <button
          className={`absolute top-2.5 right-2.5 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 ${
            isFavorite ? 'bg-white' : 'bg-white/80 hover:bg-white'
          }`}
          onClick={handleFavorite}
          aria-label={isFavorite ? t('listing.removeFromFavourites') : t('animalInfo.addToFavourites')}
        >
          {isFavorite ? (
            <MdFavorite className='text-primary w-4 h-4' />
          ) : (
            <MdFavoriteBorder className='text-gray-400 w-4 h-4' />
          )}
        </button>
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 truncate mb-1.5 text-base leading-snug'>{listing.title}</h3>
        <div className='flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500'>
          {listing.gender && <span className='capitalize'>{t(`genders.${listing.gender}`)}</span>}
          {age && (
            <>
              <span className='text-gray-300'>·</span>
              <span>{age}</span>
            </>
          )}
          {listing.size && (
            <>
              <span className='text-gray-300'>·</span>
              <span>{listing.size} kg</span>
            </>
          )}
          {listing.breed && (
            <>
              <span className='text-gray-300'>·</span>
              <span className='truncate max-w-[80px]'>{listing.breed}</span>
            </>
          )}
        </div>
        <div className='mt-2.5 pt-2.5 border-t border-gray-50 text-[11px] text-gray-400 flex items-center justify-between'>
          <span>{t('listing.listed')} {dayjs(listing.created_at).format('DD MMM YYYY')}</span>
          {listing.is_adopted && (
            <span className='text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full'>
              {t('animalInfo.adopted')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
