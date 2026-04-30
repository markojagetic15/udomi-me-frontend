import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useUpdateListing = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const { mutate: updateListing, isPending } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      return await axios.put(`/listings/${id}`, data);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update listing.');
    },
  });

  return { updateListing, isPending };
};
