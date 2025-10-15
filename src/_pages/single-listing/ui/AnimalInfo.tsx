import { useAnimalInfo } from '../hooks';
import { Divider } from '@nextui-org/divider';
import dayjs from 'dayjs';
import { CiCircleCheck } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MdFavoriteBorder } from 'react-icons/md';
import { ImageCarousel, Spinner } from '_shared';
import { InfoItem } from './InfoItem';
import { Tooltip } from '@nextui-org/react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { MdReportGmailerrorred } from 'react-icons/md';

export const AnimalInfo = () => {
  const {
    listing,
    isError,
    isLoading,
    handleFavorite,
    isFavoritePending,
    isFavorited,
  } = useAnimalInfo();

  return (
    <div className='xl:p-12 m-auto xl:w-10/12 md:w-full sm:w-full lg:p-10 md:p-5 p-2 max-w-6xl'>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
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
                flex
                justify-between
              '
              >
                {listing.title}
                <div className='flex items-center gap-2'>
                  <Tooltip content='Favorite this animal'>
                    <div className='cursor-pointer'>
                      {isFavorited ? (
                        <AiFillLike
                          className='text-primary'
                          onClick={handleFavorite}
                        />
                      ) : (
                        <AiOutlineLike
                          className='text-primary'
                          onClick={handleFavorite}
                        />
                      )}
                    </div>
                  </Tooltip>
                  <Tooltip content='Report this listing'>
                    <div className='cursor-pointer'>
                      <MdReportGmailerrorred className='text-primary' />
                    </div>
                  </Tooltip>
                </div>
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
                <InfoItem
                  value={listing.category?.toUpperCase()}
                  label='Category'
                />
                <InfoItem
                  value={listing.gender?.toUpperCase()}
                  label='Gender'
                />
                <InfoItem value={listing.size} label='Size' />
                {listing.breed && (
                  <InfoItem value={listing.breed.toUpperCase()} label='Breed' />
                )}

                {listing.date_of_birth && (
                  <InfoItem
                    value={dayjs(listing.date_of_birth)
                      .format('DD MMM YYYY')
                      .toUpperCase()}
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
                <InfoItem
                  value={
                    <>
                      {listing.is_urgent ? (
                        <CiCircleCheck className='text-primary w-6 h-6 stroke-1' />
                      ) : (
                        <IoIosCloseCircleOutline className='text-red-500 w-6 h-6' />
                      )}
                    </>
                  }
                  label='Is Urgent'
                />
              </div>
              <Divider className='bg-primary' />
              {listing.address && (
                <div>
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
                    <div>{listing.address}</div>
                  </div>
                  <Divider className='bg-primary' />
                </div>
              )}

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
                <InfoItem
                  value={
                    listing.phone_number ? listing.phone_number : 'Not provided'
                  }
                  label='Phone number'
                />
                <InfoItem
                  value={listing.email ? listing.email : 'Not provided'}
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
