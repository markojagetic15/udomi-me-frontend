import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useMarkAsAdopted = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const { mutate: markAsAdopted, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await axios.post(`/listings/${id}/adopt`);
    },
    onSuccess: () => {
      toast.success('Listing marked as adopted!');
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark as adopted');
    },
  });

  return { markAsAdopted, isPending };
};
