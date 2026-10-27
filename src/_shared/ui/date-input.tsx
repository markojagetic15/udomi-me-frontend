import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { cn } from '../lib/utils';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

dayjs.extend(customParseFormat);

const fmt = (d: Date | null | undefined) =>
  d ? dayjs(d).format('DD.MM.YYYY') : '';

// Typed or picked date in DD.MM.YYYY. Typing auto-inserts the dots;
// onChange fires with a Date once the text is a complete valid date, or null.
export const DateInput = React.forwardRef<
  HTMLInputElement,
  {
    value: Date | null | undefined;
    onChange: (d: Date | null) => void;
    fromYear?: number;
    toDate?: Date;
    fromDate?: Date;
    className?: string;
    id?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }
>(
  (
    { value, onChange, fromYear = 1990, toDate, fromDate, className, ...aria },
    ref
  ) => {
    const [text, setText] = React.useState(fmt(value));
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      // Sync from outside unless the user is mid-typing an equivalent value.
      if (!value || fmt(value) !== text) setText(fmt(value));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleText = (raw: string) => {
      const digits = raw.replace(/\D/g, '').slice(0, 8);
      const masked = [
        digits.slice(0, 2),
        digits.slice(2, 4),
        digits.slice(4, 8),
      ]
        .filter(Boolean)
        .join('.');
      setText(masked);
      if (digits.length === 8) {
        const d = dayjs(masked, 'DD.MM.YYYY', true);
        const inRange =
          d.isValid() &&
          (!toDate || !d.isAfter(toDate, 'day')) &&
          (!fromDate || !d.isBefore(fromDate, 'day'));
        onChange(inRange ? d.toDate() : null);
      } else {
        onChange(null);
      }
    };

    return (
      <div className={cn('relative', className)}>
        <input
          ref={ref}
          inputMode='numeric'
          placeholder='DD.MM.YYYY'
          value={text}
          onChange={(e) => handleText(e.target.value)}
          className='flex h-10 w-full rounded-lg border border-input bg-card py-2 pl-3 pr-11 text-sm tabular-nums shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive'
          {...aria}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            type='button'
            className='absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground'
            aria-label='Calendar'
          >
            <CalendarDays className='h-4 w-4' />
          </PopoverTrigger>
          <PopoverContent className='w-auto p-3' align='end'>
            <Calendar
              mode='single'
              selected={value ?? undefined}
              defaultMonth={value ?? toDate}
              captionLayout='dropdown-buttons'
              fromYear={fromYear}
              toDate={toDate}
              fromDate={fromDate}
              toYear={
                toDate ? toDate.getFullYear() : new Date().getFullYear() + 1
              }
              onSelect={(d) => {
                onChange(d ?? null);
                setText(fmt(d));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
DateInput.displayName = 'DateInput';
