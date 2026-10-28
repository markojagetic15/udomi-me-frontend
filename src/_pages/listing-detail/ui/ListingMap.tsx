import { useTranslation } from 'react-i18next';

// Approximate area only, never a pin on someone's house: the keyless Google
// embed can only show a pin, so coordinates are rounded to 2 decimals (~1 km).
const approx = (n: number) => n.toFixed(2);

export const ListingMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const { t, i18n } = useTranslation();
  const q = `${approx(lat)},${approx(lng)}`;
  return (
    <div className='h-64 overflow-hidden rounded-xl border'>
      <iframe
        title={t('detail.location')}
        src={`https://www.google.com/maps?q=${q}&z=13&hl=${i18n.language}&output=embed`}
        className='h-full w-full border-0'
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      />
    </div>
  );
};
