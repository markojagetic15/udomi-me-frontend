import type { PublicUser } from '../../user';

export enum Category {
  DOG = 'dog',
  CAT = 'cat',
  RABBIT = 'rabbit',
  BIRD = 'bird',
  REPTILE = 'reptile',
  HORSE = 'horse',
  OTHER = 'other',
}

export const CATEGORIES: { key: Category; emoji: string }[] = [
  { key: Category.DOG, emoji: '🐕' },
  { key: Category.CAT, emoji: '🐈' },
  { key: Category.RABBIT, emoji: '🐇' },
  { key: Category.BIRD, emoji: '🦜' },
  { key: Category.REPTILE, emoji: '🦎' },
  { key: Category.HORSE, emoji: '🐴' },
  { key: Category.OTHER, emoji: '🐾' },
];

export const categoryEmoji = (c?: Category | null) =>
  CATEGORIES.find((x) => x.key === c)?.emoji ?? '🐾';

export type ListingType = 'adoption' | 'lost' | 'found';
export type Gender = 'male' | 'female' | 'unknown';

export interface Image {
  id: string;
  url: string;
  position: number;
}

export interface Listing {
  id: string;
  listing_type: ListingType;
  title: string;
  description: string;
  images: Image[];
  category: Category;
  gender: Gender;
  date_of_birth: string | null;
  event_date: string | null;
  size: number | null;
  breed: string | null;
  is_vaccinated: boolean | null;
  is_sterilized: boolean | null;
  is_microchipped: boolean | null;
  good_with_kids: boolean | null;
  good_with_dogs: boolean | null;
  good_with_cats: boolean | null;
  medical_notes: string | null;
  adoption_fee: number | null;
  is_urgent: boolean;
  address: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  phone_number: string | null;
  email: string | null;
  is_adopted: boolean;
  is_active: boolean;
  is_hidden: boolean;
  adopted_at: string | null;
  adoption_story: string | null;
  number_of_interested_users: number;
  created_at: string;
  updated_at: string;
  user: PublicUser | null;
}

export interface ListingsResponse {
  listings: Listing[];
  meta: { total: number; page: number; take: number; totalPages: number };
}

export interface ListingInput {
  listing_type?: ListingType;
  title: string;
  description: string;
  images: Image[];
  category: Category;
  gender: Gender;
  date_of_birth?: string;
  event_date?: string;
  size?: number;
  breed?: string;
  is_vaccinated?: boolean;
  is_sterilized?: boolean;
  is_microchipped?: boolean;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  is_urgent?: boolean;
  medical_notes?: string;
  adoption_fee?: number | null;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  phone_number?: string;
  email?: string;
}

export const firstImage = (l: Pick<Listing, 'images'>) =>
  [...(l.images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? null;

export const REPORT_REASONS = [
  'scam',
  'animal_welfare',
  'selling',
  'inappropriate',
  'duplicate',
  'other',
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];
