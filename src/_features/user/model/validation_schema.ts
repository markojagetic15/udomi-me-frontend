import { boolean, object, string } from 'yup';
import * as Yup from 'yup';
import type { TFunction } from 'i18next';

export const login_schema = (t: TFunction) => object({
  email: string()
    .email(t('validation.emailInvalid'))
    .required(t('validation.emailRequired')),
  password: string().required(t('validation.passwordRequired')),
});

export const register_schema = (t: TFunction) => object({
  first_name: string().required(t('validation.firstNameRequired')),
  last_name: string().required(t('validation.lastNameRequired')),
  email: string()
    .email(t('validation.emailInvalid'))
    .required(t('validation.emailRequired')),
  password: string()
    .min(8)
    .max(20)
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      t('validation.passwordComplexity')
    )
    .required(t('validation.passwordRequired')),
  confirm_password: string()
    .required(t('validation.confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], t('validation.passwordsMismatch')),
  term_and_conditions: boolean().oneOf(
    [true],
    t('validation.termsRequired')
  ),
});

export const forgot_password_schema = (t: TFunction) => object({
  email: string().email().required(t('validation.emailRequired')),
});
