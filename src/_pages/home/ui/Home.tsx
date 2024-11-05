import { useHome } from '../hooks';
import { Button, Pagination, Spinner } from '@nextui-org/react';
import { CategoryItems, ListingItem } from '_entities/listing';
import { Input } from '_shared';
import { IoIosSearch } from 'react-icons/io';

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

  if (isError) {
    return <div className='p-44 w-10/12 m-auto'>Error</div>;
  }

  return (
    <div className='xl:p-44 m-auto xl:w-10/12 md:w-full sm:w-full lg:p-10 md:p-5 sm:p-0'>
      <div className='gap-2 flex-col flex mb-4'>
        <Input
          placeholder='Search for an animal'
          onChange={handleOnSearch}
          startIcon={<IoIosSearch />}
        />
        <div className='flex gap-2'>
          {CategoryItems.map((category) => (
            <Button
              key={category.key}
              variant={categories.includes(category.key) ? 'solid' : 'bordered'}
              onClick={() => {
                handleSetCategory(category.key);
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner size='lg' />
      ) : (
        <div>
          {listings?.length === 0 ? (
            <div className='col-span-4 text-center'>No listings found</div>
          ) : (
            <div className='grid 2xl:grid-cols-4 gap-5 md:grid-cols-3 sm:grid-cols-2'>
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
    </div>
  );
};
