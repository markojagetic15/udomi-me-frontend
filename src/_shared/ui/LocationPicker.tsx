import { useEffect, useRef, useState } from 'react';

export interface LocationValue {
  address: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const COUNTRIES: { name: string; code: string }[] = [
  { name: 'Croatia', code: 'hr' },
  { name: 'Albania', code: 'al' },
  { name: 'Austria', code: 'at' },
  { name: 'Belgium', code: 'be' },
  { name: 'Bosnia and Herzegovina', code: 'ba' },
  { name: 'Bulgaria', code: 'bg' },
  { name: 'Cyprus', code: 'cy' },
  { name: 'Czech Republic', code: 'cz' },
  { name: 'Denmark', code: 'dk' },
  { name: 'Estonia', code: 'ee' },
  { name: 'Finland', code: 'fi' },
  { name: 'France', code: 'fr' },
  { name: 'Germany', code: 'de' },
  { name: 'Greece', code: 'gr' },
  { name: 'Hungary', code: 'hu' },
  { name: 'Ireland', code: 'ie' },
  { name: 'Italy', code: 'it' },
  { name: 'Kosovo', code: 'xk' },
  { name: 'Latvia', code: 'lv' },
  { name: 'Lithuania', code: 'lt' },
  { name: 'Luxembourg', code: 'lu' },
  { name: 'Malta', code: 'mt' },
  { name: 'Montenegro', code: 'me' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'North Macedonia', code: 'mk' },
  { name: 'Norway', code: 'no' },
  { name: 'Poland', code: 'pl' },
  { name: 'Portugal', code: 'pt' },
  { name: 'Romania', code: 'ro' },
  { name: 'Serbia', code: 'rs' },
  { name: 'Slovakia', code: 'sk' },
  { name: 'Slovenia', code: 'si' },
  { name: 'Spain', code: 'es' },
  { name: 'Sweden', code: 'se' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Turkey', code: 'tr' },
  { name: 'Ukraine', code: 'ua' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United States', code: 'us' },
  { name: 'Australia', code: 'au' },
  { name: 'Canada', code: 'ca' },
  { name: 'Brazil', code: 'br' },
  { name: 'Japan', code: 'jp' },
  { name: 'China', code: 'cn' },
  { name: 'India', code: 'in' },
];

function useDebouncedSearch(query: string, countryCode: string, contextSuffix: string) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query.trim()) { setResults([]); return; }

    timer.current = setTimeout(async () => {
      try {
        const fullQuery = contextSuffix ? `${query}, ${contextSuffix}` : query;
        const params = new URLSearchParams({
          format: 'json',
          addressdetails: '1',
          limit: '6',
          'accept-language': 'en',
          q: fullQuery,
          ...(countryCode ? { countrycodes: countryCode } : {}),
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
        setResults(await res.json());
      } catch {
        setResults([]);
      }
    }, 380);

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, countryCode, contextSuffix]);

  return results;
}

function SearchInput({
  label,
  optional,
  placeholder,
  disabled,
  countryCode,
  contextSuffix,
  onSelect,
  onTextChange,
}: {
  label: string;
  optional?: boolean;
  placeholder: string;
  disabled: boolean;
  countryCode: string;
  contextSuffix: string;
  onSelect: (text: string, lat: number, lng: number) => void;
  onTextChange: (text: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const results = useDebouncedSearch(open && !disabled ? query : '', countryCode, contextSuffix);

  useEffect(() => {
    if (disabled) setQuery('');
  }, [disabled]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (v: string) => {
    setQuery(v);
    onTextChange(v);
    setOpen(true);
  };

  return (
    <div ref={wrapRef}>
      <label className='text-xs font-medium text-gray-500 mb-1.5 block'>
        {label}
        {optional && <span className='ml-1 text-gray-400 font-normal'>(optional)</span>}
      </label>
      <div className='relative'>
        <input
          type='text'
          value={query}
          disabled={disabled}
          placeholder={disabled ? '—' : placeholder}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-colors
            ${disabled
              ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-200 text-gray-700 focus:border-primary'
            } placeholder:text-gray-400`}
        />
        {query && !disabled && (
          <button
            type='button'
            onClick={() => { setQuery(''); onTextChange(''); setOpen(false); }}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none'
          >
            ×
          </button>
        )}

        {open && results.length > 0 && (
          <ul className='absolute z-[9999] top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden'>
            {results.map((r) => (
              <li
                key={r.place_id}
                className='px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 cursor-pointer border-b border-gray-50 last:border-0'
                onMouseDown={() => {
                  const short = r.display_name.split(',')[0].trim();
                  setQuery(short);
                  onTextChange(short);
                  onSelect(short, parseFloat(r.lat), parseFloat(r.lon));
                  setOpen(false);
                }}
              >
                <span className='font-medium'>{r.display_name.split(',')[0]}</span>
                <span className='text-gray-400 text-xs ml-1.5'>
                  {r.display_name.split(',').slice(1, 3).join(',')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const LocationPicker = ({
  onChange,
}: {
  value?: LocationValue;
  onChange: (v: LocationValue) => void;
}) => {
  const [countryCode, setCountryCode] = useState('hr');
  const [city, setCity] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const countryName = COUNTRIES.find((c) => c.code === countryCode)?.name ?? '';

  const emit = (c: string, ci: string, n: string, lat: number, lng: number) => {
    const parts = [n, ci, c].filter(Boolean);
    onChange({ address: parts.join(', '), lat, lng });
  };

  const handleCitySelect = (text: string, lat: number, lng: number) => {
    setCity(text);
    setNeighbourhood('');
    setCoords({ lat, lng });
    emit(countryName, text, '', lat, lng);
  };

  const handleNeighbourhoodSelect = (text: string, lat: number, lng: number) => {
    setNeighbourhood(text);
    setCoords({ lat, lng });
    emit(countryName, city, text, lat, lng);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    setCity('');
    setNeighbourhood('');
    setCoords(null);
    onChange({ address: '', lat: 0, lng: 0 });
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Country dropdown */}
      <div>
        <label className='text-xs font-medium text-gray-500 mb-1.5 block'>Country</label>
        <select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-primary transition-colors appearance-none cursor-pointer'
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <SearchInput
        label='City / Town'
        placeholder='Search city or town…'
        disabled={false}
        countryCode={countryCode}
        contextSuffix={countryName}
        onSelect={handleCitySelect}
        onTextChange={(t) => {
          setCity(t);
          if (!t) { setNeighbourhood(''); setCoords(null); onChange({ address: '', lat: 0, lng: 0 }); }
          else emit(countryName, t, neighbourhood, coords?.lat ?? 0, coords?.lng ?? 0);
        }}
      />

      {/* Neighbourhood */}
      <SearchInput
        label='Neighbourhood'
        optional
        placeholder='Search neighbourhood…'
        disabled={!city.trim()}
        countryCode={countryCode}
        contextSuffix={city ? `${city}, ${countryName}` : countryName}
        onSelect={handleNeighbourhoodSelect}
        onTextChange={(t) => {
          setNeighbourhood(t);
          emit(countryName, city, t, coords?.lat ?? 0, coords?.lng ?? 0);
        }}
      />

      {(city || neighbourhood) && (
        <p className='text-xs text-gray-400 flex items-center gap-1'>
          <span>📍</span>
          <span>{[neighbourhood, city, countryName].filter(Boolean).join(' › ')}</span>
        </p>
      )}
    </div>
  );
};
