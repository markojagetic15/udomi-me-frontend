import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '_app';
import { cn, toast } from '_shared';
import { useFavoriteListing } from '../api';
import { Listing } from '../model';

export const FavoriteButton = ({
  listing,
  className,
  size = 'sm',
}: {
  listing: Listing;
  className?: string;
  size?: 'sm' | 'lg';
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const { toggleFavorite } = useFavoriteListing();
  const isFavorite = !!user?.favorite_listings?.some(
    (l) => l.id === listing.id
  );

  return (
    <button
      type='button'
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          toast(t('listing.loginToFavourite'));
          navigate(
            `/login?next=${encodeURIComponent(window.location.pathname)}`
          );
          return;
        }
        toggleFavorite(listing);
      }}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? t('listing.removeFavourite') : t('listing.addFavourite')
      }
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 hover:bg-white active:scale-95',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11 border',
        className
      )}
    >
      <Heart
        className={cn(
          size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5',
          isFavorite
            ? 'fill-terracotta-500 text-terracotta-500'
            : 'text-foreground/70'
        )}
      />
    </button>
  );
};
