import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useFavoriteListing = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const { mutate: favoriteListing, isPending } = useMutation({
    mutationKey: ['favoriteListing'],
    mutationFn: async ({ id }: { id: string }) => {
      return await axios.post(`/listings/${id}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update favourite');
    },
  });

  return {
    favoriteListing,
    isPending,
  };
};
