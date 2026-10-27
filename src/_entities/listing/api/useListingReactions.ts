import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import type { Me } from '../../user';
import { Listing } from '../model';

// Favorite toggle, optimistic: the heart flips instantly; rolled back on error.
export const useFavoriteListing = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (listing: Listing) =>
      axios.post(`/listings/${listing.id}/favorite`),
    onMutate: async (listing) => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      const previous = queryClient.getQueryData<Me>(['me']);
      queryClient.setQueryData<Me>(['me'], (me) => {
        if (!me) return me;
        const isFav = me.favorite_listings.some((l) => l.id === listing.id);
        return {
          ...me,
          favorite_listings: isFav
            ? me.favorite_listings.filter((l) => l.id !== listing.id)
            : [...me.favorite_listings, listing],
        };
      });
      return { previous };
    },
    onError: (e, _listing, ctx) => {
      queryClient.setQueryData(['me'], ctx?.previous);
      toast.error(errorMessage(e, t));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
  return { toggleFavorite: mutation.mutate, isPending: mutation.isPending };
};

export const useShowInterest = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      id: string
    ): Promise<{ isInterested: boolean; number_of_interested_users: number }> =>
      axios.post(`/listings/${id}/interest`),
    onSuccess: (res, id) => {
      queryClient.setQueryData<{ listing: Listing }>(['listings', id], (old) =>
        old
          ? {
              listing: {
                ...old.listing,
                number_of_interested_users: res.number_of_interested_users,
              },
            }
          : old
      );
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (res.isInterested) toast.success(t('listing.interestSent'));
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { showInterest: mutation.mutate, isPending: mutation.isPending };
};
