import { Category, ListingType } from '_entities/listing';

// Browse state lives in the URL (shareable, back-button friendly). URL keys
// are short/friendly; toApiParams maps them to GET /listings params.
export const AGE_PRESETS = {
  baby: { age_min: 0, age_max: 11 },
  young: { age_min: 12, age_max: 35 },
  adult: { age_min: 36, age_max: 95 },
  senior: { age_min: 96, age_max: undefined },
} as const;
export type AgePreset = keyof typeof AGE_PRESETS;

export const SIZE_PRESETS = {
  small: { size_min: 0, size_max: 10 },
  medium: { size_min: 10, size_max: 25 },
  large: { size_min: 25, size_max: undefined },
} as const;
export type SizePreset = keyof typeof SIZE_PRESETS;

export const FLAG_FILTERS = [
  'vaccinated',
  'sterilized',
  'good_with_kids',
  'good_with_dogs',
  'good_with_cats',
  'urgent',
  'shelter_only',
  'free_only',
] as const;
export type FlagFilter = (typeof FLAG_FILTERS)[number];

export const SORTS = ['newest', 'oldest', 'nearest', 'urgent'] as const;
export type Sort = (typeof SORTS)[number];

export const RADII = [5, 10, 25, 50, 100] as const;

export interface BrowseFilters {
  q: string;
  categories: Category[];
  gender: 'male' | 'female' | '';
  age: AgePreset | '';
  size: SizePreset | '';
  city: string;
  lat: number | null;
  lng: number | null;
  radius: number | null;
  flags: FlagFilter[];
  sort: Sort;
  page: number;
}

const num = (v: string | null) =>
  v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null;

export const parseFilters = (sp: URLSearchParams): BrowseFilters => {
  const validCats = Object.values(Category) as string[];
  const age = sp.get('age') ?? '';
  const size = sp.get('size') ?? '';
  const sort = sp.get('sort') ?? 'newest';
  const gender = sp.get('gender') ?? '';
  return {
    q: sp.get('q') ?? '',
    categories: (sp.get('category') ?? '')
      .split(',')
      .filter((c) => validCats.includes(c)) as Category[],
    gender: gender === 'male' || gender === 'female' ? gender : '',
    age: age in AGE_PRESETS ? (age as AgePreset) : '',
    size: size in SIZE_PRESETS ? (size as SizePreset) : '',
    city: sp.get('city') ?? '',
    lat: num(sp.get('lat')),
    lng: num(sp.get('lng')),
    radius: num(sp.get('radius')),
    flags: FLAG_FILTERS.filter((f) => sp.get(f) === '1'),
    sort: (SORTS as readonly string[]).includes(sort)
      ? (sort as Sort)
      : 'newest',
    page: Math.max(1, num(sp.get('page')) ?? 1),
  };
};

export const filtersToSearchParams = (f: BrowseFilters): URLSearchParams => {
  const sp = new URLSearchParams();
  if (f.q) sp.set('q', f.q);
  if (f.categories.length) sp.set('category', f.categories.join(','));
  if (f.gender) sp.set('gender', f.gender);
  if (f.age) sp.set('age', f.age);
  if (f.size) sp.set('size', f.size);
  if (f.city) sp.set('city', f.city);
  if (f.lat !== null && f.lng !== null) {
    sp.set('lat', f.lat.toFixed(4));
    sp.set('lng', f.lng.toFixed(4));
  }
  if (f.radius) sp.set('radius', String(f.radius));
  f.flags.forEach((fl) => sp.set(fl, '1'));
  if (f.sort !== 'newest') sp.set('sort', f.sort);
  if (f.page > 1) sp.set('page', String(f.page));
  return sp;
};

// Filters only (no paging/sort) in backend GET /listings format — also what
// saved searches store.
export const toApiFilters = (
  f: BrowseFilters,
  type: ListingType
): Record<string, string> => {
  const p: Record<string, string> = { type };
  if (f.q) p.search = f.q;
  if (f.categories.length) p.category = f.categories.join(',');
  if (f.gender) p.gender = f.gender;
  if (f.age) {
    const a = AGE_PRESETS[f.age];
    p.age_min = String(a.age_min);
    if (a.age_max !== undefined) p.age_max = String(a.age_max);
  }
  if (f.size) {
    const s = SIZE_PRESETS[f.size];
    p.size_min = String(s.size_min);
    if (s.size_max !== undefined) p.size_max = String(s.size_max);
  }
  const hasPoint = f.lat !== null && f.lng !== null;
  if (hasPoint && f.radius) {
    p.lat = String(f.lat);
    p.lng = String(f.lng);
    p.radius_km = String(f.radius);
  } else if (f.city) {
    p.city = f.city;
  }
  f.flags.forEach((fl) => (p[fl] = 'true'));
  return p;
};

export const toApiParams = (
  f: BrowseFilters,
  type: ListingType,
  limit: number
): Record<string, string> => {
  const p: Record<string, string> = {
    ...toApiFilters(f, type),
    page: String(f.page),
    limit: String(limit),
    sort: f.sort,
  };
  // "nearest" needs a point even without a radius.
  if (f.sort === 'nearest' && f.lat !== null && f.lng !== null) {
    p.lat = String(f.lat);
    p.lng = String(f.lng);
  }
  return p;
};

// Saved search (backend-parsed filters) → browse URL.
export const savedFiltersToUrl = (saved: Record<string, unknown>): string => {
  const type = (saved.type as ListingType) ?? 'adoption';
  const sp = new URLSearchParams();
  if (saved.search) sp.set('q', String(saved.search));
  if (Array.isArray(saved.categories) && saved.categories.length)
    sp.set('category', saved.categories.join(','));
  if (saved.gender) sp.set('gender', String(saved.gender));
  const age = (Object.keys(AGE_PRESETS) as AgePreset[]).find(
    (k) => AGE_PRESETS[k].age_min === saved.age_min
  );
  if (age) sp.set('age', age);
  const size = (Object.keys(SIZE_PRESETS) as SizePreset[]).find(
    (k) => SIZE_PRESETS[k].size_min === saved.size_min
  );
  if (size) sp.set('size', size);
  if (saved.city) sp.set('city', String(saved.city));
  if (saved.lat !== undefined && saved.lng !== undefined) {
    sp.set('lat', String(saved.lat));
    sp.set('lng', String(saved.lng));
  }
  if (saved.radius_km) sp.set('radius', String(saved.radius_km));
  FLAG_FILTERS.forEach((f) => saved[f] && sp.set(f, '1'));
  const path = type === 'adoption' ? '/browse' : `/lost-found?type=${type}`;
  const qs = sp.toString();
  return qs ? `${path}${path.includes('?') ? '&' : '?'}${qs}` : path;
};

export const activeFilterCount = (f: BrowseFilters) =>
  f.categories.length +
  (f.gender ? 1 : 0) +
  (f.age ? 1 : 0) +
  (f.size ? 1 : 0) +
  (f.city ? 1 : 0) +
  f.flags.length;

export const EMPTY_FILTERS: BrowseFilters = {
  q: '',
  categories: [],
  gender: '',
  age: '',
  size: '',
  city: '',
  lat: null,
  lng: null,
  radius: null,
  flags: [],
  sort: 'newest',
  page: 1,
};
