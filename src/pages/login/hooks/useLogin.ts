import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const schema = object({
  email: string().email().required('Email is required'),
  password: string()
    .min(8)
    .max(20)
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number or special character'
    )
    .required('Password is required'),
});

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return axios.post(
        'http://localhost:9000/api/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      // navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
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
