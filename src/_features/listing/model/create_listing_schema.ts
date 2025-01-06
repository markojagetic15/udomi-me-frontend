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

  images: yup
    .array()
    .max(8, 'You can upload at most 8 images')
    .of(
      yup.object().shape({
        id: yup.string().required(),
        url: yup.string().url().required(),
        position: yup.number().required(),
      })
    )
    .min(1, 'Please upload at least one image')
    .required('Images are required'),

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

  size: yup
    .number()
    .typeError('Size must be a number')
    .required('Size is required'),

  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Gender is required')
    .required('Gender is required'),
});
