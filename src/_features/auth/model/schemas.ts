import * as yup from 'yup';
import type { TFunction } from 'i18next';

// Mirrors the backend rule (register.dto.ts PASSWORD_RULE).
export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/;

const password = (t: TFunction) =>
  yup
    .string()
    .required(t('validation.passwordRequired'))
    .min(8, t('validation.passwordMin'))
    .max(72, t('validation.passwordMax'))
    .matches(PASSWORD_RULE, t('validation.passwordWeak'));

export const loginSchema = (t: TFunction) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: yup.string().required(t('validation.passwordRequired')),
  });

export const registerSchema = (t: TFunction) =>
  yup.object({
    first_name: yup
      .string()
      .trim()
      .required(t('validation.firstNameRequired'))
      .max(50),
    last_name: yup
      .string()
      .trim()
      .required(t('validation.lastNameRequired'))
      .max(50),
    email: yup
      .string()
      .trim()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: password(t),
    accept_terms: yup
      .boolean()
      .oneOf([true], t('validation.acceptTerms'))
      .required(t('validation.acceptTerms')),
  });

export const forgotSchema = (t: TFunction) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
  });

export const resetSchema = (t: TFunction) =>
  yup.object({
    password: password(t),
    confirm: yup
      .string()
      .required(t('validation.confirmRequired'))
      .oneOf([yup.ref('password')], t('validation.passwordsMatch')),
  });

export const changePasswordSchema = (t: TFunction) =>
  yup.object({
    currentPassword: yup.string().required(t('validation.passwordRequired')),
    newPassword: password(t),
    confirm: yup
      .string()
      .required(t('validation.confirmRequired'))
      .oneOf([yup.ref('newPassword')], t('validation.passwordsMatch')),
  });
