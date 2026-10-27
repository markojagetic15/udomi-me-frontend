import dayjs from 'dayjs';
import {
  Category,
  Gender,
  Listing,
  ListingInput,
  ListingType,
} from '_entities/listing';
import { ListingFormValues } from './schema';

export const emptyListingForm = (
  type: ListingType = 'adoption'
): ListingFormValues => ({
  listing_type: type,
  title: '',
  description: '',
  images: [],
  category: '',
  gender: '',
  date_of_birth: null,
  event_date: type === 'adoption' ? null : new Date(),
  size: '',
  breed: '',
  is_vaccinated: false,
  is_sterilized: false,
  is_microchipped: false,
  good_with_kids: false,
  good_with_dogs: false,
  good_with_cats: false,
  is_urgent: false,
  medical_notes: '',
  fee_mode: 'unspecified',
  adoption_fee: '',
  location: { address: '', city: '', lat: null, lng: null },
  phone_number: '',
  email: '',
});

export const listingToForm = (l: Listing): ListingFormValues => ({
  listing_type: l.listing_type,
  title: l.title,
  description: l.description ?? '',
  images: [...(l.images ?? [])].sort((a, b) => a.position - b.position),
  category: l.category ?? '',
  gender: l.gender ?? '',
  date_of_birth: l.date_of_birth ? new Date(l.date_of_birth) : null,
  event_date: l.event_date ? new Date(l.event_date) : null,
  size: l.size ? String(l.size) : '',
  breed: l.breed ?? '',
  is_vaccinated: !!l.is_vaccinated,
  is_sterilized: !!l.is_sterilized,
  is_microchipped: !!l.is_microchipped,
  good_with_kids: !!l.good_with_kids,
  good_with_dogs: !!l.good_with_dogs,
  good_with_cats: !!l.good_with_cats,
  is_urgent: !!l.is_urgent,
  medical_notes: l.medical_notes ?? '',
  fee_mode:
    l.adoption_fee === null || l.adoption_fee === undefined
      ? 'unspecified'
      : l.adoption_fee === 0
        ? 'free'
        : 'fee',
  adoption_fee: l.adoption_fee ? String(l.adoption_fee) : '',
  location: {
    address: l.address ?? '',
    city: l.city ?? '',
    lat: l.lat,
    lng: l.lng,
  },
  phone_number: l.phone_number ?? '',
  email: l.email ?? '',
});

// Dates go out as local-midnight ISO strings so DD.MM.YYYY round-trips.
const isoDay = (d: Date | null) =>
  d ? dayjs(d).startOf('day').toISOString() : undefined;

export const formToInput = (v: ListingFormValues): ListingInput => {
  const isAdoption = v.listing_type === 'adoption';
  return {
    listing_type: v.listing_type,
    title: v.title.trim(),
    description: v.description.trim(),
    images: v.images.map((img, i) => ({ ...img, position: i })),
    category: v.category as Category,
    gender: v.gender as Gender,
    date_of_birth: isoDay(v.date_of_birth),
    event_date: isAdoption ? undefined : isoDay(v.event_date),
    size: v.size ? Number(v.size) : undefined,
    breed: v.breed.trim() || undefined,
    is_vaccinated: v.is_vaccinated,
    is_sterilized: v.is_sterilized,
    is_microchipped: v.is_microchipped,
    good_with_kids: isAdoption ? v.good_with_kids : undefined,
    good_with_dogs: isAdoption ? v.good_with_dogs : undefined,
    good_with_cats: isAdoption ? v.good_with_cats : undefined,
    is_urgent: isAdoption ? v.is_urgent : false,
    medical_notes: v.medical_notes.trim() || undefined,
    adoption_fee:
      !isAdoption || v.fee_mode === 'unspecified'
        ? null
        : v.fee_mode === 'free'
          ? 0
          : Number(v.adoption_fee),
    address: v.location.address || undefined,
    city: v.location.city || undefined,
    lat: v.location.lat ?? undefined,
    lng: v.location.lng ?? undefined,
    phone_number: v.phone_number.trim() || undefined,
    email: v.email.trim() || undefined,
  };
};
