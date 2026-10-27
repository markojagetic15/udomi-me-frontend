import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Me } from '../model';

// Auth mutations. Errors are surfaced by the calling form (inline), so no
// toast here.

export const useLogin = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (e: unknown) => void } = {}) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: { email: string; password: string }): Promise<Me> =>
      axios.post('/login', dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      onSuccess?.();
    },
    onError,
  });
  return { login: mutation.mutate, isPending: mutation.isPending };
};

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  accept_terms: boolean;
  language: 'hr' | 'en';
}

export const useRegister = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (e: unknown) => void } = {}) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: RegisterInput): Promise<Me> => axios.post('/signup', dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      onSuccess?.();
    },
    onError,
  });
  return { register: mutation.mutate, isPending: mutation.isPending };
};

export const useForgotPassword = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (e: unknown) => void } = {}) => {
  const { axios } = useAxios();
  const mutation = useMutation({
    mutationFn: (dto: { email: string }) => axios.post('/forgot-password', dto),
    onSuccess,
    onError,
  });
  return { forgotPassword: mutation.mutate, isPending: mutation.isPending };
};

export const useResetPassword = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (e: unknown) => void } = {}) => {
  const { axios } = useAxios();
  const mutation = useMutation({
    mutationFn: (dto: { token: string; password: string }) =>
      axios.post('/reset-password', dto),
    onSuccess,
    onError,
  });
  return { resetPassword: mutation.mutate, isPending: mutation.isPending };
};

export const useChangePassword = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (e: unknown) => void } = {}) => {
  const { axios } = useAxios();
  const mutation = useMutation({
    mutationFn: (dto: { currentPassword: string; newPassword: string }) =>
      axios.post('/change-password', dto),
    onSuccess,
    onError,
  });
  return { changePassword: mutation.mutate, isPending: mutation.isPending };
};

export const useLogout = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => axios.post('/logout'),
    onSettled: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
      window.location.href = '/';
    },
  });
  return { logout: mutation.mutate, isPending: mutation.isPending };
};
