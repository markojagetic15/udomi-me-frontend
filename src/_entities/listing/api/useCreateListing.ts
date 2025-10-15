import { useAxios } from '_app';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDto } from '../model';

export const useCreateListing = ({ onSuccess }: { onSuccess: () => void }) => {
  const { axios } = useAxios();

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: async (data: CreateListingDto) => {
      return await axios.post('/listings', data);
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return {
    createListing,
    isPending,
  };
};
