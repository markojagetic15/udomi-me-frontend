import { useMyListings } from '../hooks';
import { Spinner } from '_shared';
import { ListingItem } from '_entities/listing';

export const MyListings = () => {
  const { listings, isLoading } = useMyListings();

  return (
    <div
      className='
        w-full lg:max-w-6xl m-auto mt-24 mb-24
    '
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {listings?.length === 0 ? (
            <div>No listings found</div>
          ) : (
            <div>
              {' '}
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
