import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { LocateFixed } from 'lucide-react';
import {
  Button,
  Checkbox,
  Label,
  PlaceSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  cn,
  toast,
} from '_shared';
import { CATEGORIES, Category } from '_entities/listing';
import {
  AGE_PRESETS,
  AgePreset,
  BrowseFilters,
  FlagFilter,
  RADII,
  SIZE_PRESETS,
  SizePreset,
} from '../model';

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type='button'
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
      active
        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
        : 'border-input bg-card text-foreground hover:border-primary/60 hover:bg-secondary'
    )}
  >
    {children}
  </button>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className='flex flex-col gap-3'>
    <h3 className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
      {title}
    </h3>
    {children}
  </section>
);

const FlagRow = ({
  flag,
  label,
  filters,
  onToggle,
}: {
  flag: FlagFilter;
  label: string;
  filters: BrowseFilters;
  onToggle: (f: FlagFilter) => void;
}) => {
  const id = `flag-${flag}`;
  return (
    <div className='flex items-center gap-2.5'>
      <Checkbox
        id={id}
        checked={filters.flags.includes(flag)}
        onCheckedChange={() => onToggle(flag)}
      />
      <Label htmlFor={id} className='cursor-pointer font-normal'>
        {label}
      </Label>
    </div>
  );
};

export const FilterPanel = ({
  filters,
  update,
  reset,
  variant = 'adoption',
}: {
  filters: BrowseFilters;
  update: (patch: Partial<BrowseFilters>) => void;
  reset: () => void;
  variant?: 'adoption' | 'lostFound';
}) => {
  const { t } = useTranslation();
  const [cityText, setCityText] = React.useState(filters.city);
  const [locating, setLocating] = React.useState(false);
  React.useEffect(() => {
    setCityText(filters.city);
  }, [filters.city]);

  const toggleCategory = (c: Category) =>
    update({
      categories: filters.categories.includes(c)
        ? filters.categories.filter((x) => x !== c)
        : [...filters.categories, c],
    });
  const toggleFlag = (f: FlagFilter) =>
    update({
      flags: filters.flags.includes(f)
        ? filters.flags.filter((x) => x !== f)
        : [...filters.flags, f],
    });

  const useMyLocation = () => {
    if (!navigator.geolocation) return toast.error(t('filters.geoUnavailable'));
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        update({
          city: t('filters.nearMe'),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radius: filters.radius ?? 25,
        });
      },
      () => {
        setLocating(false);
        toast.error(t('filters.geoDenied'));
      },
      { timeout: 10_000 }
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      <Section title={t('filters.species')}>
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              active={filters.categories.includes(c.key)}
              onClick={() => toggleCategory(c.key)}
            >
              <span aria-hidden>{c.emoji}</span>
              {t(`category.${c.key}`)}
            </Chip>
          ))}
        </div>
      </Section>

      <Separator />

      <Section title={t('filters.location')}>
        <PlaceSearch
          value={cityText}
          layers={['city']}
          countryCode='hr'
          placeholder={t('filters.cityPlaceholder')}
          onValueChange={(text) => {
            setCityText(text);
            if (!text) update({ city: '', lat: null, lng: null, radius: null });
          }}
          onSelect={(p) => update({ city: p.name, lat: p.lat, lng: p.lng })}
        />
        <div className='flex gap-2'>
          <Select
            value={filters.radius ? String(filters.radius) : 'city'}
            onValueChange={(v) =>
              update({ radius: v === 'city' ? null : Number(v) })
            }
            disabled={filters.lat === null}
          >
            <SelectTrigger className='flex-1' aria-label={t('filters.radius')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='city'>{t('filters.onlyThisCity')}</SelectItem>
              {RADII.map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {t('filters.withinKm', { km: r })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={useMyLocation}
            loading={locating}
            aria-label={t('filters.useMyLocation')}
            title={t('filters.useMyLocation')}
          >
            {!locating && <LocateFixed />}
          </Button>
        </div>
      </Section>

      <Separator />

      <Section title={t('filters.gender')}>
        <div className='flex flex-wrap gap-2'>
          {(['male', 'female'] as const).map((g) => (
            <Chip
              key={g}
              active={filters.gender === g}
              onClick={() => update({ gender: filters.gender === g ? '' : g })}
            >
              {t(`gender.${g}`)}
            </Chip>
          ))}
        </div>
      </Section>

      {variant === 'adoption' && (
        <>
          <Section title={t('filters.age')}>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(AGE_PRESETS) as AgePreset[]).map((a) => (
                <Chip
                  key={a}
                  active={filters.age === a}
                  onClick={() => update({ age: filters.age === a ? '' : a })}
                >
                  {t(`filters.agePreset.${a}`)}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title={t('filters.size')}>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(SIZE_PRESETS) as SizePreset[]).map((s) => (
                <Chip
                  key={s}
                  active={filters.size === s}
                  onClick={() => update({ size: filters.size === s ? '' : s })}
                >
                  {t(`filters.sizePreset.${s}`)}
                </Chip>
              ))}
            </div>
          </Section>

          <Separator />

          <Section title={t('filters.health')}>
            <FlagRow
              flag='vaccinated'
              label={t('traits.vaccinated')}
              filters={filters}
              onToggle={toggleFlag}
            />
            <FlagRow
              flag='sterilized'
              label={t('traits.sterilized')}
              filters={filters}
              onToggle={toggleFlag}
            />
          </Section>

          <Section title={t('filters.temperament')}>
            <FlagRow
              flag='good_with_kids'
              label={t('traits.goodWithKids')}
              filters={filters}
              onToggle={toggleFlag}
            />
            <FlagRow
              flag='good_with_dogs'
              label={t('traits.goodWithDogs')}
              filters={filters}
              onToggle={toggleFlag}
            />
            <FlagRow
              flag='good_with_cats'
              label={t('traits.goodWithCats')}
              filters={filters}
              onToggle={toggleFlag}
            />
          </Section>

          <Section title={t('filters.other')}>
            <FlagRow
              flag='urgent'
              label={t('filters.urgentOnly')}
              filters={filters}
              onToggle={toggleFlag}
            />
            <FlagRow
              flag='shelter_only'
              label={t('filters.sheltersOnly')}
              filters={filters}
              onToggle={toggleFlag}
            />
            <FlagRow
              flag='free_only'
              label={t('filters.freeOnly')}
              filters={filters}
              onToggle={toggleFlag}
            />
          </Section>
        </>
      )}

      <Button
        variant='ghost'
        className='self-start text-muted-foreground'
        onClick={reset}
      >
        {t('filters.reset')}
      </Button>
    </div>
  );
};
