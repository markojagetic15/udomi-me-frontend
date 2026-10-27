import { useAxios } from '_app';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';

export const useVerifyEmail = (token: string | null) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const verifyEmail = useQuery({
    queryKey: ['verify-email', token],
    queryFn: async () => {
      const res = await axios.get(
        `/auth/verify-email?token=${encodeURIComponent(token ?? '')}`
      );
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      return res;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
  return { verifyEmail };
};

export const useResendVerification = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: () => axios.post('/auth/resend-verification'),
    onSuccess: () => toast.success(t('verify.resent')),
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return {
    resendVerification: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
