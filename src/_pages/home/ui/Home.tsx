import { useHome } from '../hooks';
import { Pagination, Spinner } from '@nextui-org/react';
import { CategoryItems, ListingItem } from '_entities/listing';
import { Input } from '_shared';
import { IoIosSearch } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import SadDog from '_assets/sad_dog_outline_transparent.png';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { t } = useTranslation();
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
    <div className='w-full lg:max-w-6xl m-auto mt-8 pb-24 px-4'>
      {/* Search + Filters */}
      <div className='mb-8 flex flex-col gap-3'>
        <Input
          placeholder={t('home.searchPlaceholder')}
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
                {t(`categories.${cat.key}`)}
              </button>
            );
          })}

          {categories.length > 0 && (
            <button
              onClick={clearCategories}
              className='flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all'
            >
              <IoMdClose />
              {t('home.clear')}
            </button>
          )}
        </div>
      </div>

      {isError ? (
        <div className='mt-24 flex flex-col items-center gap-4 text-center'>
          <div className='text-5xl'>😕</div>
          <p className='text-gray-700 font-medium'>
            {(error as any)?.message || t('home.failedToLoad')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm'
          >
            {t('home.retry')}
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
                <div className='mt-16 flex flex-col items-center gap-2'>
                  <p className='text-gray-500 text-lg font-medium'>{t('home.noAnimals')}</p>
                  <img src={SadDog} alt='No animals found' className='h-auto w-80 translate-x-6 mt-4 opacity-80' />
                </div>
              ) : (
                <div className='grid 2xl:grid-cols-4 gap-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2'>
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
