import * as yup from 'yup';
import { Category } from '_entities/listing';
import type { TFunction } from 'i18next';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const create_listing_schema = (t: TFunction) => yup.object().shape({
  title: yup
    .string()
    .required(t('validation.titleRequired'))
    .min(3, t('validation.titleMin'))
    .max(50, t('validation.titleMax')),

  description: yup
    .string()
    .required(t('validation.descriptionRequired'))
    .min(5, t('validation.descriptionMin'))
    .max(500, t('validation.descriptionMax')),

  images: yup
    .array()
    .max(8, t('validation.imagesMax'))
    .of(
      yup.object().shape({
        id: yup.string().required(),
        url: yup.string().url().required(),
        position: yup.number().required(),
      })
    )
    .optional()
    .default([]),

  area_code: yup.string().optional(),
  lat: yup.number().optional(),
  lng: yup.number().optional(),

  phone_number: yup.string().notRequired().matches(phoneRegExp, {
    message: t('validation.phoneInvalid'),
    excludeEmptyString: true,
  }),

  address: yup.string().optional(),

  email: yup.string().email().optional(),

  category: yup
    .string()
    .oneOf(Object.values(Category), t('validation.categoryRequired'))
    .required(t('validation.categoryRequired')),

  date_of_birth: yup.date().required(t('validation.dateOfBirthRequired')),

  is_vaccinated: yup.boolean().optional(),

  is_urgent: yup.boolean().optional(),

  breed: yup.string().optional(),

  size: yup
    .number()
    .typeError(t('validation.sizeNumber'))
    .required(t('validation.sizeRequired')),

  gender: yup
    .string()
    .oneOf(['male', 'female'], t('validation.genderRequired'))
    .required(t('validation.genderRequired')),
});
