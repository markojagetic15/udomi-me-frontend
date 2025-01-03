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

  images: yup.string().required('Please upload at least one image'),

  area_code: yup.string(),

  phone_number: yup.string().notRequired().matches(phoneRegExp, {
    message: 'Phone number is not valid',
    excludeEmptyString: true,
  }),

  category: yup
    .string()
    .oneOf(Object.values(Category), 'Category is required')
    .required('Category is required'),

  date_of_birth: yup.date().optional(),

  is_vaccinated: yup.boolean().optional(),

  is_urgent: yup.boolean().optional(),

  breed: yup.string().optional(),

  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Gender is required')
    .required('Gender is required'),
});
