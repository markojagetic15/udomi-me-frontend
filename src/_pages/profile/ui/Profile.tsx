import { Avatar, Spinner } from '_shared';
import { ListingItem } from '_entities/listing';
import { useProfile } from '../hooks';
import dayjs from 'dayjs';

export const Profile = () => {
  const { listings, isLoading, isError, user } = useProfile();

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800 mt-8 mb-4'>Profile</h1>
        <div>
          <div className='flex flex-col gap-4'>
            <div>
              <div className='text-gray-800 font-bold'>Profile picture</div>
              <div>
                <Avatar user={user} src={user?.avatar} size='lg' />
              </div>
            </div>
            <div>
              <div className='text-gray-800 font-bold'>Name</div>
              <div>
                {user?.first_name} {user?.last_name}
              </div>
            </div>
            <div>
              <div className='text-gray-800 font-bold'>Email</div>
              <div>{user?.email}</div>
            </div>
            <div>
              <div className='text-gray-800 font-bold'>Joined</div>
              <div>{dayjs(user?.created_at).format('DD.MM.YYYY')}</div>
            </div>
          </div>
        </div>
      </div>
      <div id='listings'>
        <h1 className='text-2xl font-bold text-gray-800 mt-8 mb-4'>Listings</h1>
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
                    <div className='col-span-4 text-center'>
                      No animals found
                    </div>
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
      <div id='listings'>
        <h1 className='text-2xl font-bold text-gray-800 mt-8 mb-4'>
          Listings you are interested in
        </h1>
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
                    <div className='col-span-4 text-center'>
                      No animals found
                    </div>
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
    </div>
  );
};
