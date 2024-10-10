import { useForm } from 'react-hook-form';
import { boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const schema = object({
  first_name: string().required('First name is required'),
  last_name: string().required('Last name is required'),
  email: string().email().required('Email is required'),
  password: string()
    .min(8)
    .max(20)
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number or special character'
    )
    .required('Password is required'),
  confirm_password: string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
  term_and_conditions: boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

export const useRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    console.log(data);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
  };
};
