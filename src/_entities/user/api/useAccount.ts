import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import { Me } from '../model';

export interface ShelterInput {
  shelter_name: string;
  shelter_city: string;
  shelter_description: string;
  shelter_website?: string;
  shelter_phone?: string;
}

export const useApplyShelter = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: ShelterInput): Promise<Me> =>
      axios.put('/me/shelter', dto),
    onSuccess: (me) => {
      queryClient.setQueryData<Me>(['me'], (old) =>
        old ? { ...old, ...me } : me
      );
      toast.success(
        me.shelter_status === 'pending'
          ? t('shelter.submitted')
          : t('toast.saved')
      );
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { applyShelter: mutation.mutate, isPending: mutation.isPending };
};

export const useWithdrawShelter = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (): Promise<Me> => axios.post('/me/shelter/withdraw'),
    onSuccess: (me) =>
      queryClient.setQueryData<Me>(['me'], (old) =>
        old ? { ...old, ...me } : me
      ),
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { withdrawShelter: mutation.mutate, isPending: mutation.isPending };
};

// GDPR: download everything we store about the user as JSON.
export const useExportMe = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: (): Promise<unknown> => axios.get('/me/export'),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'udomi-me-data.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { exportMe: mutation.mutate, isPending: mutation.isPending };
};

export const useDeleteMe = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: () => axios.delete('/me'),
    onSuccess: () => {
      window.location.href = '/?deleted=1';
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { deleteMe: mutation.mutate, isPending: mutation.isPending };
};
