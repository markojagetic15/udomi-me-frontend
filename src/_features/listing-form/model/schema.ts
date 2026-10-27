import * as yup from 'yup';
import type { TFunction } from 'i18next';
import { Category, Gender, Image, ListingType } from '_entities/listing';
import type { LocationValue } from '_shared';

export type FeeMode = 'unspecified' | 'free' | 'fee';

export interface ListingFormValues {
  listing_type: ListingType;
  title: string;
  description: string;
  images: Image[];
  category: Category | '';
  gender: Gender | '';
  date_of_birth: Date | null;
  event_date: Date | null;
  size: string;
  breed: string;
  is_vaccinated: boolean;
  is_sterilized: boolean;
  is_microchipped: boolean;
  good_with_kids: boolean;
  good_with_dogs: boolean;
  good_with_cats: boolean;
  is_urgent: boolean;
  medical_notes: string;
  fee_mode: FeeMode;
  adoption_fee: string;
  location: LocationValue;
  phone_number: string;
  email: string;
}

const today = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

export const listingSchema = (t: TFunction) =>
  yup.object({
    listing_type: yup
      .mixed<ListingType>()
      .oneOf(['adoption', 'lost', 'found'])
      .required(),
    title: yup
      .string()
      .trim()
      .required(t('validation.titleRequired'))
      .min(3, t('validation.titleMin'))
      .max(60, t('validation.titleMax')),
    description: yup
      .string()
      .trim()
      .required(t('validation.descriptionRequired'))
      .min(5, t('validation.descriptionMin'))
      .max(2000, t('validation.descriptionMax')),
    images: yup
      .array()
      .min(1, t('validation.imagesRequired'))
      .max(8, t('validation.imagesMax'))
      .required(),
    category: yup.string().required(t('validation.categoryRequired')),
    gender: yup.string().required(t('validation.genderRequired')),
    date_of_birth: yup
      .date()
      .nullable()
      .max(today(), t('validation.dateFuture'))
      .when('listing_type', {
        is: 'adoption',
        then: (s) => s.required(t('validation.dateOfBirthRequired')),
      }),
    event_date: yup
      .date()
      .nullable()
      .max(today(), t('validation.dateFuture'))
      .when('listing_type', {
        is: (v: string) => v !== 'adoption',
        then: (s) => s.required(t('validation.eventDateRequired')),
      }),
    size: yup
      .string()
      .test(
        'size',
        t('validation.sizeInvalid'),
        (v) => !v || (Number(v) >= 0 && Number(v) <= 200)
      ),
    breed: yup.string().max(60),
    medical_notes: yup.string().max(1000),
    fee_mode: yup
      .mixed<FeeMode>()
      .oneOf(['unspecified', 'free', 'fee'])
      .required(),
    adoption_fee: yup.string().when('fee_mode', {
      is: 'fee',
      then: (s) =>
        s
          .required(t('validation.feeRequired'))
          .test(
            'fee',
            t('validation.feeInvalid'),
            (v) => Number(v) > 0 && Number(v) <= 10000
          ),
    }),
    location: yup
      .object({
        city: yup.string().trim().required(t('validation.cityRequired')),
      })
      .required(),
    phone_number: yup
      .string()
      .matches(/^[0-9 ()+\-/]{6,30}$/, {
        message: t('validation.phoneInvalid'),
        excludeEmptyString: true,
      }),
    email: yup.string().email(t('validation.emailInvalid')),
  });
