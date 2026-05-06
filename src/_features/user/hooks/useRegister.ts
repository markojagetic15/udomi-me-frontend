import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '_app';
import { register_schema } from '../model';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { axios } = useAxios();

  const mutation = useMutation({
    mutationFn: ({
      first_name,
      last_name,
      email,
      password,
    }: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }) => {
      return axios.post('/signup', {
        first_name,
        last_name,
        email,
        password,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success(t('toast.accountCreated'));
      navigate('/browse');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(register_schema(t)),
  });

  const onSubmit = (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    mutation.mutate(data);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL as string}/google`;
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    showConfirmPassword,
    handleTogglePassword,
    handleToggleConfirmPassword,
    navigate,
    handleGoogleRegister,
    isLoading: mutation.isPending,
  };
};
