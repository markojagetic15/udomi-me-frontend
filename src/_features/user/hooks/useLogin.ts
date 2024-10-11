import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAxios } from '_app';
import { login_schema } from '../model';

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { axios } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(login_schema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return axios.post('/login', {
        email,
        password,
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

  const onSubmit = (data: { email: string; password: string }) => {
    mutation.mutate(data);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    handleTogglePassword,
    navigate,
  };
};
