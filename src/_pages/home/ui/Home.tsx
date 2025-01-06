import { useHome } from '../hooks';
import { Pagination, Spinner } from '@nextui-org/react';
import { CategoryItems, ListingItem } from '_entities/listing';
import { Dropdown, Input } from '_shared';
import { IoIosSearch } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa';
import SadDog from '_assets/sad_dog_outline_transparent.png';

export const Home = () => {
  const {
    listings,
    isLoading,
    currentPage,
    setCurrentPage,
    isError,
    totalPages,
    handleOnSearch,
    handleSetCategory,
    categories,
  } = useHome();

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full'>
      <div className='gap-6 flex mb-8 items-center'>
        <Input
          placeholder='Search for an animal'
          onChange={handleOnSearch}
          startIcon={<IoIosSearch />}
          width={'w-96'}
        />

        <Dropdown
          trigger={
            <div>
              {' '}
              <FaFilter className='text-white' />
            </div>
          }
          items={CategoryItems.map((category) => ({
            key: category.key,
            label: category.label,
            onClick: () => handleSetCategory(category.key),
            icon: category.icon,
          }))}
          selectedKeys={categories}
        />
      </div>

      {isError ? (
        <div>The error has happened</div>
      ) : (
        <>
          {isLoading ? (
            <Spinner size='lg' />
          ) : (
            <div>
              {listings?.length === 0 ? (
                <div className='mt-24 flex flex-col items-center'>
                  Sorry, no animals found for adoption{' '}
                  <img src={SadDog} className='h-auto w-96 translate-x-8' />
                </div>
              ) : (
                <div className='grid 2xl:grid-cols-4 gap-5 md:grid-cols-4 grid-cols-2'>
                  {listings?.map((listing) => (
                    <ListingItem listing={listing} key={listing.id} />
                  ))}
                </div>
              )}

              <div className='flex flex-col gap-5 mt-10 justify-end w-full'>
                {!!totalPages && (
                  <Pagination
                    total={totalPages}
                    color='primary'
                    page={currentPage}
                    onChange={setCurrentPage}
                    initialPage={1}
                    showControls
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
