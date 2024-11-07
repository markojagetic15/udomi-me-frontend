import { boolean, object, string } from 'yup';
import * as Yup from 'yup';

export const login_schema = object({
  email: string()
    .email('Email must be a valid email address')
    .required('Email is required'),
  password: string().required('Password is required'),
});

export const register_schema = object({
  first_name: string().required('First name is required'),
  last_name: string().required('Last name is required'),
  email: string()
    .email('Email must be a valid email address')
    .required('Email is required'),
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

export const forgot_password_schema = object({
  email: string().email().required('Email is required'),
});
