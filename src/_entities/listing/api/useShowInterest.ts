import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useShowInterest = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const { mutate: showInterest, isPending } = useMutation({
    mutationKey: ['showInterest'],
    mutationFn: async ({ id }: { id: string }) => {
      return await axios.post(`/listings/${id}/interest`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['listing'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update interest');
    },
  });

  return { showInterest, isPending };
};
