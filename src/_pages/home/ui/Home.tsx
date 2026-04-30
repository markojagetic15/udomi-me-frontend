import { useHome } from '../hooks';
import { Pagination, Spinner } from '@nextui-org/react';
import { CategoryItems, ListingItem } from '_entities/listing';
import { Input } from '_shared';
import { IoIosSearch } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import SadDog from '_assets/sad_dog_outline_transparent.png';

export const Home = () => {
  const {
    listings,
    isLoading,
    page,
    setPage,
    isError,
    error,
    totalPages,
    handleOnSearch,
    handleSetCategory,
    clearCategories,
    categories,
  } = useHome();

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full px-4'>
      {/* Search + Filters */}
      <div className='flex flex-col gap-3 mb-8'>
        <Input
          placeholder='Search for an animal...'
          onChange={handleOnSearch}
          startIcon={<IoIosSearch className='text-gray-400' />}
        />

        <div className='flex flex-wrap gap-2 items-center'>
          {CategoryItems.map((cat) => {
            const isActive = categories.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => handleSetCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white/70 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}

          {categories.length > 0 && (
            <button
              onClick={clearCategories}
              className='flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all'
            >
              <IoMdClose />
              Clear
            </button>
          )}
        </div>
      </div>

      {isError ? (
        <div className='mt-24 flex flex-col items-center gap-3'>
          <p className='text-gray-700 font-medium'>
            {(error as any)?.message || 'Failed to load listings. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 rounded-xl bg-primary text-white text-sm hover:opacity-90 transition-opacity'
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className='flex justify-center mt-24'>
              <Spinner size='lg' />
            </div>
          ) : (
            <div>
              {listings?.length === 0 ? (
                <div className='mt-24 flex flex-col items-center'>
                  <p className='text-gray-600 mb-4'>No animals found for adoption</p>
                  <img src={SadDog} className='h-auto w-96 translate-x-8' />
                </div>
              ) : (
                <div className='grid 2xl:grid-cols-4 gap-5 md:grid-cols-4 grid-cols-2'>
                  {listings?.map((listing) => (
                    <ListingItem listing={listing} key={listing.id} />
                  ))}
                </div>
              )}

              <div className='flex flex-col gap-5 mt-10 justify-center w-full items-center'>
                {!!totalPages && totalPages > 1 && (
                  <Pagination
                    total={totalPages}
                    color='primary'
                    page={page}
                    onChange={setPage}
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
