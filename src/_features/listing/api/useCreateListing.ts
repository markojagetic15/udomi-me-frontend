import { useAxios } from '_app';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDto } from '_entities/listing';

export const useCreateListing = () => {
  const { axios } = useAxios();

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: (data: CreateListingDto) => {
      return axios.post('/listings', data);
    },
    onSuccess: () => {},
  });

  return {
    createListing,
    isPending,
  };
};
