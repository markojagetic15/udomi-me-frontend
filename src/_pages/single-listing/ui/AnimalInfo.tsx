import { useAnimalInfo } from '../hooks';
import { Divider } from '@nextui-org/divider';
import dayjs from 'dayjs';
import { CiCircleCheck } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { ImageCarousel } from '_shared';
import { InfoItem } from './InfoItem';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const AnimalInfo = () => {
  const { listing, isError, isLoading } = useAnimalInfo();

  return (
    <div className='xl:p-12 m-auto xl:w-10/12 md:w-full sm:w-full lg:p-10 md:p-5 p-2 max-w-6xl'>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {listing && (
            <div>
              <ImageCarousel images={listing.images} />
              <h1
                className='
                text-3xl
                font-bold
                mt-12
                mb-12
                text-primary-600
              '
              >
                {listing.title}
              </h1>
              <Divider className='bg-primary' />
              <h2
                className='
                text-xl
                font-bold
                mt-12
                mb-6
              '
              >
                Description
              </h2>
              <div className='mb-12'>{listing.description}</div>
              <Divider className='bg-primary' />
              <div className='mt-12 flex justify-between items-center w-full mb-12'>
                <InfoItem value={listing.category} label='Category' />
                <InfoItem value={listing.breed} label='Breed' />
                <InfoItem value={listing.gender} label='Gender' />
                {listing.date_of_birth && (
                  <InfoItem
                    value={dayjs(listing.date_of_birth).format('DD MMM YYYY')}
                    label='Date of Birth'
                  />
                )}
                <InfoItem
                  value={
                    <>
                      {listing.is_vaccinated ? (
                        <CiCircleCheck className='text-primary w-6 h-6 stroke-1' />
                      ) : (
                        <IoIosCloseCircleOutline className='text-red-500 w-6 h-6' />
                      )}
                    </>
                  }
                  label='Is Vaccinated'
                />
              </div>
              <Divider className='bg-primary' />
              <div className='mt-12 mb-12'>
                <h2
                  className='
                text-xl
                font-bold
                mt-12
                mb-6
              '
                >
                  Location
                </h2>
                <MapContainer
                  center={[51.505, -0.09]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '500px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  <Marker position={[51.505, -0.09]}>
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <Divider className='bg-primary' />
              <h2
                className='
                text-xl
                font-bold
                mt-12
                mb-6
              '
              >
                Contact info
              </h2>
              <div className='mt-12 flex gap-40 items-center w-full mb-12'>
                <InfoItem value={listing.email} label='Email' />
                <InfoItem
                  value={
                    listing.phone_number ? listing.phone_number : 'Not provided'
                  }
                  label='Phone number'
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
