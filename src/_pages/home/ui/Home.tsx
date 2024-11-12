import { useHome } from '../hooks';
import { Pagination, Spinner } from '@nextui-org/react';
import { CategoryItems, ListingItem } from '_entities/listing';
import { Dropdown, Input } from '_shared';
import { IoIosSearch } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa';

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
    <div className='w-full lg:max-w-6xl m-auto mt-24 mb-24'>
      <div className='gap-2 flex mb-4 items-center'>
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
              <FaFilter />
            </div>
          }
          items={CategoryItems.map((category) => ({
            key: category.key,
            label: category.label,
            onClick: () => handleSetCategory(category.key),
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
                <div className='col-span-4 text-center'>No animals found</div>
              ) : (
                <div className='grid 2xl:grid-cols-3 gap-5 md:grid-cols-3 sm:grid-cols-2'>
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
