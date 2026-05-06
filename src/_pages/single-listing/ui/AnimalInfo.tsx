import { useAnimalInfo } from '../hooks';
import { Divider } from '@nextui-org/divider';
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

import { CiCircleCheck } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { ImageCarousel, Spinner } from '_shared';
import { InfoItem } from './InfoItem';
import { Tooltip } from '@nextui-org/react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { MdReportGmailerrorred } from 'react-icons/md';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { ErrorPage } from '_pages/error';
import { useTranslation } from 'react-i18next';

export const AnimalInfo = () => {
  const { t } = useTranslation();
  const {
    listing,
    isError,
    isLoading,
    handleFavorite,
    handleShowInterest,
    isFavoritePending,
    isInterestPending,
    isFavorited,
    isInterested,
    isOwner,
  } = useAnimalInfo();

  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!listing) return;
    if (listing.lat && listing.lng) {
      setMapCoords({ lat: listing.lat, lng: listing.lng });
      return;
    }
    if (!listing.address) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listing.address)}&limit=1&accept-language=en`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.[0]) setMapCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      })
      .catch(() => {});
  }, [listing?.id]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center mt-24'>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage code={404} />;
  }

  if (!listing) return null;

  const interestCount = listing.number_of_interested_users ?? 0;

  return (
    <div className='xl:p-12 m-auto xl:w-10/12 md:w-full sm:w-full lg:p-10 md:p-5 p-4 max-w-6xl'>
      <ImageCarousel images={listing.images} />

      <div className='mt-10 mb-8 flex justify-between items-start gap-4'>
        <div>
          <div className='flex items-center gap-2 flex-wrap mb-2'>
            {listing.category && (
              <span className='text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide'>
                {t(`categories.${listing.category}`)}
              </span>
            )}
            {listing.is_adopted && (
              <span className='text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-wide'>
                {t('animalInfo.adopted')}
              </span>
            )}
            {listing.is_urgent && (
              <span className='text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600 uppercase tracking-wide'>
                {t('animalInfo.urgent')}
              </span>
            )}
          </div>
          <h1 className='text-3xl font-extrabold text-primary-700 leading-tight'>{listing.title}</h1>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <Tooltip content={t('animalInfo.addToFavourites')}>
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-all hover:scale-110 ${
                isFavoritePending ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={handleFavorite}
              aria-label={t('animalInfo.addToFavourites')}
            >
              {isFavorited ? (
                <MdFavorite className='text-primary w-5 h-5' />
              ) : (
                <MdFavoriteBorder className='text-gray-400 w-5 h-5' />
              )}
            </button>
          </Tooltip>
          <Tooltip content={t('animalInfo.reportListing')}>
            <button
              className='w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-all hover:scale-110'
              aria-label={t('animalInfo.reportListing')}
            >
              <MdReportGmailerrorred className='text-gray-400 w-5 h-5' />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Interest CTA — hidden from the listing owner and for adopted listings */}
      {!isOwner && !listing.is_adopted && (
        <div className='mb-8 flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm'>
          <div className='flex-1'>
            <p className='font-semibold text-gray-800'>
              {interestCount > 0
                ? t('animalInfo.interestedCount_other', { count: interestCount }).replace(
                    /\d+ /,
                    `${interestCount} `
                  )
                : t('animalInfo.beFirst')}
            </p>
            <p className='text-sm text-gray-500 mt-0.5'>
              {t('animalInfo.letOwnerKnow')}
            </p>
          </div>
          <button
            onClick={handleShowInterest}
            disabled={isInterestPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
              isInterested
                ? 'bg-primary text-white hover:opacity-90'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {isInterested ? (
              <>
                <BsHandThumbsUpFill className='w-4 h-4' />
                {t('animalInfo.interested')}
              </>
            ) : (
              <>
                <BsHandThumbsUp className='w-4 h-4' />
                {t('animalInfo.imInterested')}
              </>
            )}
          </button>
        </div>
      )}

      {listing.is_adopted && (
        <div className='mb-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3'>
          <CiCircleCheck className='text-green-500 w-7 h-7 flex-shrink-0 stroke-1' />
          <div>
            <p className='font-semibold text-green-800'>{t('animalInfo.foundHome')}</p>
            <p className='text-sm text-green-600 mt-0.5'>{t('animalInfo.noLongerAvailable')}</p>
          </div>
        </div>
      )}

      <Divider className='bg-primary/30' />

      {listing.description && (
        <>
          <h2 className='text-lg font-bold mt-8 mb-3 text-gray-800'>{t('animalInfo.description')}</h2>
          <p className='text-gray-600 leading-relaxed mb-8'>{listing.description}</p>
          <Divider className='bg-primary/30' />
        </>
      )}

      <div className='mt-8 flex flex-wrap gap-4 mb-8'>
        {listing.category && (
          <InfoItem value={t(`categories.${listing.category}`).toUpperCase()} label={t('animalInfo.category')} />
        )}
        {listing.gender && (
          <InfoItem value={t(`genders.${listing.gender}`).toUpperCase()} label={t('animalInfo.gender')} />
        )}
        <InfoItem value={`${listing.size} kg`} label={t('animalInfo.size')} />
        {listing.breed && (
          <InfoItem value={listing.breed.toUpperCase()} label={t('animalInfo.breed')} />
        )}
        {listing.date_of_birth && (
          <InfoItem
            value={dayjs(listing.date_of_birth).format('DD MMM YYYY').toUpperCase()}
            label={t('animalInfo.dateOfBirth')}
          />
        )}
        <InfoItem
          value={
            listing.is_vaccinated ? (
              <CiCircleCheck className='text-primary w-6 h-6 stroke-1' />
            ) : (
              <IoIosCloseCircleOutline className='text-red-400 w-6 h-6' />
            )
          }
          label={t('animalInfo.vaccinated')}
        />
        <InfoItem
          value={
            listing.is_urgent ? (
              <CiCircleCheck className='text-primary w-6 h-6 stroke-1' />
            ) : (
              <IoIosCloseCircleOutline className='text-red-400 w-6 h-6' />
            )
          }
          label={t('animalInfo.urgent')}
        />
        {interestCount > 0 && (
          <InfoItem value={interestCount.toString()} label={t('animalInfo.interested_label')} />
        )}
      </div>

      {(listing.address || mapCoords) && (
        <>
          <Divider className='bg-primary/30' />
          <div className='mt-8 mb-8'>
            <h2 className='text-lg font-bold mb-3 text-gray-800'>{t('animalInfo.location')}</h2>
            {listing.address && (
              <p className='text-gray-600 mb-4'>{listing.address}</p>
            )}
            {mapCoords ? (
              <div className='w-full h-56 rounded-2xl overflow-hidden border border-gray-200'>
                <MapContainer
                  center={[mapCoords.lat, mapCoords.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  <Circle
                    center={[mapCoords.lat, mapCoords.lng]}
                    radius={800}
                    pathOptions={{ color: '#8EAF9D', fillColor: '#8EAF9D', fillOpacity: 0.2, weight: 2 }}
                  />
                </MapContainer>
              </div>
            ) : listing.address && (
              <div className='w-full h-56 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center'>
                <div className='w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin' />
              </div>
            )}
          </div>
        </>
      )}

      {(listing.phone_number || listing.email || listing.area_code) && (
        <>
          <Divider className='bg-primary/30' />
          <h2 className='text-lg font-bold mt-8 mb-4 text-gray-800'>{t('animalInfo.contactInfo')}</h2>
          <div className='flex gap-4 flex-wrap items-center mb-8'>
            {listing.area_code && (
              <InfoItem value={listing.area_code} label={t('animalInfo.areaCode')} />
            )}
            {listing.phone_number && (
              <InfoItem value={listing.phone_number} label={t('animalInfo.phoneNumber')} />
            )}
            {listing.email && (
              <InfoItem value={listing.email} label={t('animalInfo.email')} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
