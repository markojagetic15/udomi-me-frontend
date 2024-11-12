import { useAnimalInfo } from '../hooks';
import { Divider } from '@nextui-org/divider';
import dayjs from 'dayjs';
import { CiCircleCheck } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { ImageCarousel } from '_shared';
import { InfoItem } from './InfoItem';

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
            </div>
          )}
        </>
      )}
    </div>
  );
};
