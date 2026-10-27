import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useForgotPassword,
  useLogin,
  useRegister,
  useResetPassword,
} from '_entities/user';
import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from '_features/auth';
import { errorMessage } from '_shared';

// Same-site paths only (never an open redirect).
const safeNext = (next: string | null) =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : '/browse';

export const useLoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const [serverError, setServerError] = useState(
    searchParams.get('error') === 'banned' ? t('errors.ACCOUNT_BANNED') : ''
  );
  const form = useForm({ resolver: yupResolver(loginSchema(t)) });
  const { login, isPending } = useLogin({
    onSuccess: () => navigate(next, { replace: true }),
    onError: (e) => setServerError(errorMessage(e, t)),
  });
  return {
    form,
    serverError,
    isPending,
    next,
    onSubmit: form.handleSubmit((v) => {
      setServerError('');
      login(v);
    }),
  };
};

export const useRegisterPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState('');
  const form = useForm({
    resolver: yupResolver(registerSchema(t)),
    defaultValues: { accept_terms: false },
  });
  const { register, isPending } = useRegister({
    onSuccess: () =>
      navigate(safeNext(searchParams.get('next')), { replace: true }),
    onError: (e) => setServerError(errorMessage(e, t)),
  });
  return {
    form,
    serverError,
    isPending,
    onSubmit: form.handleSubmit((v) => {
      setServerError('');
      register({
        ...v,
        accept_terms: true,
        language: i18n.language === 'en' ? 'en' : 'hr',
      });
    }),
  };
};

export const useForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const form = useForm({ resolver: yupResolver(forgotSchema(t)) });
  const { forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => setSent(true),
    onError: (e) => setServerError(errorMessage(e, t)),
  });
  return {
    form,
    sent,
    serverError,
    isPending,
    onSubmit: form.handleSubmit((v) => forgotPassword(v)),
  };
};

export const useResetPasswordPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');
  const form = useForm({ resolver: yupResolver(resetSchema(t)) });
  const { resetPassword, isPending } = useResetPassword({
    onSuccess: () => setDone(true),
    onError: (e) => setServerError(errorMessage(e, t)),
  });
  return {
    form,
    token,
    done,
    serverError,
    isPending,
    onSubmit: form.handleSubmit(
      (v) => token && resetPassword({ token, password: v.password })
    ),
  };
};
