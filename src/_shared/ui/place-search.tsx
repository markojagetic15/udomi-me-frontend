import * as React from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { Place, searchPlaces } from '../lib/photon';

// Debounced Photon combobox. Arrow keys + Enter select; Escape closes.
export const PlaceSearch = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onValueChange: (text: string) => void;
    onSelect: (place: Place) => void;
    countryCode?: string;
    layers?: string[];
    near?: { lat: number; lng: number } | null;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }
>(
  (
    {
      value,
      onValueChange,
      onSelect,
      countryCode,
      layers,
      near,
      placeholder,
      disabled,
      className,
      ...aria
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [results, setResults] = React.useState<Place[]>([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [active, setActive] = React.useState(0);
    const listId = React.useId();
    const wrap = React.useRef<HTMLDivElement>(null);
    const layersKey = layers?.join(',');

    React.useEffect(() => {
      if (!open || disabled || value.trim().length < 2) {
        setResults([]);
        return;
      }
      const ctrl = new AbortController();
      setLoading(true);
      const timer = setTimeout(() => {
        searchPlaces(value.trim(), {
          countryCode,
          layers,
          near,
          signal: ctrl.signal,
        })
          .then((r) => {
            setResults(r);
            setActive(0);
          })
          .catch(() => undefined)
          .finally(() => setLoading(false));
      }, 350);
      return () => {
        clearTimeout(timer);
        ctrl.abort();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, open, disabled, countryCode, layersKey, near?.lat, near?.lng]);

    React.useEffect(() => {
      const close = (e: MouseEvent) => {
        if (wrap.current && !wrap.current.contains(e.target as Node))
          setOpen(false);
      };
      document.addEventListener('mousedown', close);
      return () => document.removeEventListener('mousedown', close);
    }, []);

    const pick = (p: Place) => {
      onSelect(p);
      setOpen(false);
    };

    return (
      <div ref={wrap} className={cn('relative', className)}>
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <input
          ref={ref}
          type='text'
          role='combobox'
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete='list'
          autoComplete='off'
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onValueChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (!results.length) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => (a + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => (a - 1 + results.length) % results.length);
            } else if (e.key === 'Enter' && open) {
              e.preventDefault();
              pick(results[active]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          className='flex h-10 w-full rounded-lg border border-input bg-card py-2 pl-9 pr-9 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive'
          {...aria}
        />
        <span className='absolute right-2 top-1/2 -translate-y-1/2'>
          {loading ? (
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          ) : value && !disabled ? (
            <button
              type='button'
              onClick={() => onValueChange('')}
              className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary'
              aria-label={t('common.clear')}
            >
              <X className='h-3.5 w-3.5' />
            </button>
          ) : null}
        </span>
        {open && results.length > 0 && (
          <ul
            id={listId}
            role='listbox'
            className='absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border bg-popover p-1.5 shadow-lift animate-in fade-in-0'
          >
            {results.map((r, i) => (
              <li
                key={r.id}
                role='option'
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(r);
                }}
                className={cn(
                  'flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm',
                  i === active && 'bg-secondary'
                )}
              >
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                <span className='min-w-0'>
                  <span className='block truncate font-medium'>{r.name}</span>
                  {r.context && (
                    <span className='block truncate text-xs text-muted-foreground'>
                      {r.context}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
PlaceSearch.displayName = 'PlaceSearch';
