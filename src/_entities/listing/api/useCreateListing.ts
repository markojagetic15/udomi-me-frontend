import { useAxios } from '_app';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDto } from '../model';
import { toast } from 'react-toastify';

export const useCreateListing = ({ onSuccess }: { onSuccess: () => void }) => {
  const { axios } = useAxios();

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: async (data: CreateListingDto) => {
      return await axios.post('/listings', data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create listing. Please try again.');
    },
  });

  return {
    createListing,
    isPending,
  };
};
