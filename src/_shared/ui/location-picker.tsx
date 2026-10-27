import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { PlaceSearch } from './place-search';

export interface LocationValue {
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
}

// Croatia first, then the region and the most common diaspora countries.
const COUNTRIES: { code: string; name: { hr: string; en: string } }[] = [
  { code: 'hr', name: { hr: 'Hrvatska', en: 'Croatia' } },
  {
    code: 'ba',
    name: { hr: 'Bosna i Hercegovina', en: 'Bosnia and Herzegovina' },
  },
  { code: 'si', name: { hr: 'Slovenija', en: 'Slovenia' } },
  { code: 'rs', name: { hr: 'Srbija', en: 'Serbia' } },
  { code: 'me', name: { hr: 'Crna Gora', en: 'Montenegro' } },
  { code: 'at', name: { hr: 'Austrija', en: 'Austria' } },
  { code: 'de', name: { hr: 'Njemačka', en: 'Germany' } },
  { code: 'it', name: { hr: 'Italija', en: 'Italy' } },
  { code: 'hu', name: { hr: 'Mađarska', en: 'Hungary' } },
];

export const LocationPicker = ({
  value,
  onChange,
  error,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  error?: string;
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'hr';
  const [country, setCountry] = React.useState('hr');
  const [cityText, setCityText] = React.useState(value.city);
  const [areaText, setAreaText] = React.useState(() => {
    const first = value.address.split(',')[0]?.trim();
    return first && first !== value.city ? first : '';
  });
  const [cityPoint, setCityPoint] = React.useState<{
    lat: number;
    lng: number;
  } | null>(
    value.lat != null && value.lng != null
      ? { lat: value.lat, lng: value.lng }
      : null
  );
  const countryName =
    COUNTRIES.find((c) => c.code === country)?.name[lang] ?? '';
  const ids = {
    country: React.useId(),
    city: React.useId(),
    area: React.useId(),
  };

  React.useEffect(() => {
    // Edit form loads asynchronously — adopt the initial value once it arrives.
    if (value.city && !cityText) setCityText(value.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.city]);

  const emit = (
    city: string,
    area: string,
    lat: number | null,
    lng: number | null
  ) =>
    onChange({
      address: [area, city, countryName].filter(Boolean).join(', '),
      city,
      lat,
      lng,
    });

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor={ids.country}>{t('location.country')}</Label>
        <Select
          value={country}
          onValueChange={(c) => {
            setCountry(c);
            setCityText('');
            setAreaText('');
            setCityPoint(null);
            onChange({ address: '', city: '', lat: null, lng: null });
          }}
        >
          <SelectTrigger id={ids.country}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor={ids.city}>
          {t('location.city')} <span className='text-terracotta-600'>*</span>
        </Label>
        <PlaceSearch
          id={ids.city}
          value={cityText}
          countryCode={country}
          layers={['city']}
          placeholder={t('location.cityPlaceholder')}
          aria-invalid={!!error}
          onValueChange={(text) => {
            setCityText(text);
            if (!text) {
              setAreaText('');
              setCityPoint(null);
            }
            // Typed but not picked: keep the text, drop stale coordinates.
            emit(text, areaText, null, null);
          }}
          onSelect={(p) => {
            setCityText(p.name);
            setAreaText('');
            setCityPoint({ lat: p.lat, lng: p.lng });
            emit(p.name, '', p.lat, p.lng);
          }}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor={ids.area} className='flex items-baseline gap-1'>
          {t('location.area')}{' '}
          <span className='text-xs font-normal text-muted-foreground'>
            ({t('common.optional')})
          </span>
        </Label>
        <PlaceSearch
          id={ids.area}
          value={areaText}
          disabled={!cityText}
          countryCode={country}
          layers={['district', 'locality']}
          near={cityPoint}
          placeholder={t('location.areaPlaceholder')}
          onValueChange={(text) => {
            setAreaText(text);
            emit(
              cityText,
              text,
              cityPoint?.lat ?? null,
              cityPoint?.lng ?? null
            );
          }}
          onSelect={(p) => {
            setAreaText(p.name);
            emit(cityText, p.name, p.lat, p.lng);
          }}
        />
      </div>

      {error ? (
        <p className='text-xs font-medium text-destructive sm:col-span-3'>
          {error}
        </p>
      ) : value.address ? (
        <p className='flex items-center gap-1.5 text-xs text-muted-foreground sm:col-span-3'>
          <MapPin className='h-3.5 w-3.5' /> {value.address}
        </p>
      ) : null}
    </div>
  );
};
