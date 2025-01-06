import { User } from '../../user';
import { FaCat, FaDog, FaHorseHead } from 'react-icons/fa';
import { PiBirdFill, PiRabbitFill } from 'react-icons/pi';
import { GiPig, GiReptileTail } from 'react-icons/gi';
import { AreaCodes } from './area-codes';

export enum Category {
  DOG = 'dog',
  CAT = 'cat',
  RABBIT = 'rabbit',
  BIRD = 'bird',
  REPTILE = 'reptile',
  HORSE = 'horse',
  OTHER = 'other',
}

export const CategoryItems = [
  { label: 'Dog', key: Category.DOG, icon: <FaDog /> },
  { label: 'Cat', key: Category.CAT, icon: <FaCat /> },
  { label: 'Rabbit', key: Category.RABBIT, icon: <PiRabbitFill /> },
  { label: 'Bird', key: Category.BIRD, icon: <PiBirdFill /> },
  { label: 'Reptile', key: Category.REPTILE, icon: <GiReptileTail /> },
  { label: 'Horse', key: Category.HORSE, icon: <FaHorseHead /> },
  { label: 'Other', key: Category.OTHER, icon: <GiPig /> },
];

export const GenderItems = [
  { label: 'Male', key: 'male' },
  { label: 'Female', key: 'female' },
];

export const AreaCodesItems = AreaCodes.map((areaCode) => ({
  label: `(${areaCode.code}) ${areaCode.dial_code} `,
  key: `(${areaCode.code}) ${areaCode.dial_code} `,
}));

export interface Image {
  position: number;
  url: string;
  id: string;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  images: Image[];
  address?: string;
  phone_number?: string;
  email?: string;
  date_of_birth?: Date;
  is_vaccinated?: boolean;
  breed?: string;
  gender?: 'male' | 'female';
  category?: Category;
  user: User;
  created_at: Date;
  updated_at: Date;
  is_urgent: boolean;
  size: number;
}

export interface GetAllListingsResponse {
  listings: Listing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type CreateListingDto = {
  title: string;
  description: string;
  images: {
    url: string;
    id: string;
  }[];
  address?: string;
  phone_number?: string | null;
  category: Category;
  date_of_birth?: Date | null;
  is_vaccinated?: boolean;
  breed?: string | null;
  gender: 'male' | 'female';
};
