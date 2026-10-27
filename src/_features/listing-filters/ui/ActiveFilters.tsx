import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoryEmoji } from '_entities/listing';
import { BrowseFilters, FlagFilter } from '../model';

const flagLabel: Record<FlagFilter, string> = {
  vaccinated: 'traits.vaccinated',
  sterilized: 'traits.sterilized',
  good_with_kids: 'traits.goodWithKids',
  good_with_dogs: 'traits.goodWithDogs',
  good_with_cats: 'traits.goodWithCats',
  urgent: 'filters.urgentOnly',
  shelter_only: 'filters.sheltersOnly',
  free_only: 'filters.freeOnly',
};

// Removable chips summarising what's applied.
export const ActiveFilters = ({
  filters,
  update,
}: {
  filters: BrowseFilters;
  update: (p: Partial<BrowseFilters>) => void;
}) => {
  const { t } = useTranslation();
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.categories.map((c) => ({
      key: `c-${c}`,
      label: `${categoryEmoji(c)} ${t(`category.${c}`)}`,
      remove: () =>
        update({ categories: filters.categories.filter((x) => x !== c) }),
    })),
    ...(filters.city
      ? [
          {
            key: 'city',
            label: filters.radius
              ? `${filters.city} +${filters.radius} km`
              : filters.city,
            remove: () =>
              update({ city: '', lat: null, lng: null, radius: null }),
          },
        ]
      : []),
    ...(filters.gender
      ? [
          {
            key: 'g',
            label: t(`gender.${filters.gender}`),
            remove: () => update({ gender: '' }),
          },
        ]
      : []),
    ...(filters.age
      ? [
          {
            key: 'a',
            label: t(`filters.agePreset.${filters.age}`),
            remove: () => update({ age: '' }),
          },
        ]
      : []),
    ...(filters.size
      ? [
          {
            key: 's',
            label: t(`filters.sizePreset.${filters.size}`),
            remove: () => update({ size: '' }),
          },
        ]
      : []),
    ...filters.flags.map((f) => ({
      key: f,
      label: t(flagLabel[f]),
      remove: () => update({ flags: filters.flags.filter((x) => x !== f) }),
    })),
  ];
  if (!chips.length) return null;
  return (
    <div className='flex flex-wrap gap-2'>
      {chips.map((c) => (
        <button
          key={c.key}
          type='button'
          onClick={c.remove}
          className='inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/70'
        >
          {c.label}
          <X className='h-3.5 w-3.5' aria-label={t('common.remove')} />
        </button>
      ))}
    </div>
  );
};
