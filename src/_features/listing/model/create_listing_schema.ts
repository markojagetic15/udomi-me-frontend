import * as yup from 'yup';
import { Category } from '_entities/listing';

export const create_listing_schema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Title must be at most 50 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be at most 500 characters'),

  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().required('Image URL is required'),
        id: yup.string().required('Image ID is required'),
      })
    )
    .required('Images are required'),

  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be at most 500 characters'),

  phone_number: yup.string().required('Phone number is required'),

  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),

  category: yup
    .string()
    .oneOf(Object.values(Category), 'Invalid category')
    .required('Category is required'),

  date_of_birth: yup.date().optional(),

  is_vaccinated: yup.boolean().optional(),

  breed: yup.string().optional(),

  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Invalid gender')
    .required('Gender is required'),
});
