import { useAxios } from '_app';
import { useMutation } from '@tanstack/react-query';

export const useFavoriteListing = () => {
  const { axios } = useAxios();

  const { mutate: favoriteListing, isPending } = useMutation({
    mutationKey: ['favoriteListing'],
    mutationFn: async ({ id }: { id: string }) => {
      return await axios.post(`/listings/${id}/favorite`);
    },
    onSuccess: () => {},
  });

  return {
    favoriteListing,
    isPending,
  };
};
