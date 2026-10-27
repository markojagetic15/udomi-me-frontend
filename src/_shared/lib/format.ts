import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hr';
import type { TFunction } from 'i18next';

dayjs.extend(relativeTime);

// All user-facing dates are DD.MM.YYYY.
export const formatDate = (d: string | Date | null | undefined) =>
  d ? dayjs(d).format('DD.MM.YYYY') : '';

export const formatDateTime = (d: string | Date | null | undefined) =>
  d ? dayjs(d).format('DD.MM.YYYY. HH:mm') : '';

export const formatTime = (d: string | Date) => dayjs(d).format('HH:mm');

export const fromNow = (d: string | Date, lang: string) =>
  dayjs(d)
    .locale(lang === 'en' ? 'en' : 'hr')
    .fromNow();

// "2 godine", "5 mjeseci", "3 tjedna" — localized via i18n plurals.
export const formatAge = (
  dob: string | Date | null | undefined,
  t: TFunction
) => {
  if (!dob) return null;
  const months = dayjs().diff(dayjs(dob), 'month');
  if (months < 0) return null;
  if (months < 1)
    return t('age.weeks', {
      count: Math.max(1, dayjs().diff(dayjs(dob), 'week')),
    });
  if (months < 12) return t('age.months', { count: months });
  const years = Math.floor(months / 12);
  return t('age.years', { count: years });
};

export const formatPrice = (fee: number | null | undefined, t: TFunction) => {
  if (fee === null || fee === undefined) return null;
  if (fee === 0) return t('listing.free');
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(fee);
};
