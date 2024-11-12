import { User } from '../../user';

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
  { label: 'Dog', key: Category.DOG },
  { label: 'Cat', key: Category.CAT },
  { label: 'Rabbit', key: Category.RABBIT },
  { label: 'Bird', key: Category.BIRD },
  { label: 'Reptile', key: Category.REPTILE },
  { label: 'Horse', key: Category.HORSE },
  { label: 'Other', key: Category.OTHER },
];

export const GenderItems = [
  { label: 'Male', key: 'male' },
  { label: 'Female', key: 'female' },
];

export interface Listing {
  id: string;
  title: string;
  description?: string;
  images: { url: string; id: string }[];
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
  address: string;
  phone_number: string;
  email: string;
  category: Category;
  date_of_birth?: Date | null;
  is_vaccinated?: boolean;
  breed?: string | null;
  gender: 'male' | 'female';
};
