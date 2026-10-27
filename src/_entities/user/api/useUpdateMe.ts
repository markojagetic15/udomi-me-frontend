import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import { Language, Me } from '../model';

export interface UpdateMeInput {
  first_name?: string;
  last_name?: string;
  language?: Language;
  email_notifications?: boolean;
  avatar_url?: string | null;
}

export const useUpdateMe = ({
  onSuccess,
  silent,
}: { onSuccess?: () => void; silent?: boolean } = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: UpdateMeInput): Promise<Me> => axios.put('/me', dto),
    onSuccess: (me) => {
      queryClient.setQueryData<Me>(['me'], (old) =>
        old ? { ...old, ...me } : me
      );
      if (!silent) toast.success(t('toast.saved'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { updateMe: mutation.mutate, isPending: mutation.isPending };
};
