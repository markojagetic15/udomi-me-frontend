import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useDeleteListing = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  const { mutate: deleteListing, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await axios.delete(`/listings/${id}`);
    },
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete listing');
    },
  });

  return { deleteListing, isPending };
};
