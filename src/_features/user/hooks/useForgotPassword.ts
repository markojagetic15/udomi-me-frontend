import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAxios } from '_app';
import { forgot_password_schema } from '../model';
import { yupResolver } from '@hookform/resolvers/yup';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  const { axios } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgot_password_schema),
  });

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return axios.post('/forgot-password', {
        email,
      });
    },
    onSuccess: () => {
      // TODO: Add deep linking
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: { email: string }) => {
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    navigate,
  };
};
