import { useMutation } from '@tanstack/react-query';
import { useAxios } from '_app';

export const useLogout = () => {
  const { axios } = useAxios();

  const { mutate } = useMutation({
    mutationFn: () => {
      return axios.post('/logout');
    },
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  return {
    logout: mutate,
  };
};
