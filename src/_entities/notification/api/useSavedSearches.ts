import { useAxios } from '_app';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import { SavedSearch } from '../model';

export const useGetSavedSearches = (enabled = true) => {
  const { axios } = useAxios();
  const getSavedSearches = useQuery({
    queryKey: ['saved-searches'],
    queryFn: async (): Promise<SavedSearch[]> => axios.get('/saved-searches'),
    enabled,
  });
  return { getSavedSearches };
};

export const useCreateSavedSearch = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: { name: string; filters: Record<string, string> }) =>
      axios.post('/saved-searches', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      toast.success(t('savedSearch.created'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { createSavedSearch: mutation.mutate, isPending: mutation.isPending };
};

export const useDeleteSavedSearch = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/saved-searches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      toast.success(t('savedSearch.deleted'));
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { deleteSavedSearch: mutation.mutate, isPending: mutation.isPending };
};
