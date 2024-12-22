import * as yup from 'yup';
import { Category } from '_entities/listing';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const create_listing_schema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(1, 'Title must be at least 5 characters')
    .max(50, 'Title must be at most 50 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be at most 500 characters'),

  images: yup.string(),

  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be at most 500 characters'),

  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid'),

  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),

  category: yup
    .string()
    .oneOf(Object.values(Category), 'Category is required')
    .required('Category is required'),

  date_of_birth: yup.date().optional(),

  is_vaccinated: yup.boolean().optional(),

  breed: yup.string().required('Breed is required'),

  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Gender is required')
    .required('Gender is required'),
});
