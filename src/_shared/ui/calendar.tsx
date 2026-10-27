import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { hr, enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();
  return (
    <DayPicker
      locale={i18n.language === 'en' ? enGB : hr}
      showOutsideDays={showOutsideDays}
      className={cn('p-1', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'space-y-3',
        caption: 'flex justify-center pt-1 relative items-center gap-1',
        caption_label: 'text-sm font-semibold hidden',
        caption_dropdowns:
          'flex gap-1.5 [&_select]:rounded-md [&_select]:border [&_select]:border-input [&_select]:bg-card [&_select]:px-1.5 [&_select]:py-1 [&_select]:text-sm [&_select]:font-medium',
        dropdown_month: '',
        dropdown_year: '',
        vhidden: 'sr-only',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'h-7 w-7'
        ),
        nav_button_previous: 'absolute left-0',
        nav_button_next: 'absolute right-0',
        table: 'w-full border-collapse',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-medium text-[0.75rem]',
        row: 'flex w-full mt-1',
        cell: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-secondary text-secondary-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-40',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className='h-4 w-4' />,
        IconRight: () => <ChevronRight className='h-4 w-4' />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
