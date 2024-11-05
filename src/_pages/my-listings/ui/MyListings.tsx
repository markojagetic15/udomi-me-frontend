import { useMyListings } from '../hooks';
import { Spinner } from '_shared';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';

export const MyListings = () => {
  const { listings, isLoading } = useMyListings();

  return (
    <div
      className='
        grid grid-cols-4 gap-4 p-44
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
              {listings?.map((listing) => (
                <Card className='py-4'>
                  <CardBody className='overflow-visible py-2'>
                    <Image
                      src={listing.images?.[0].url}
                      alt={listing.title}
                      isZoomed
                    />
                  </CardBody>
                  <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                    <p className='text-tiny uppercase font-bold'>
                      {listing.description}
                    </p>
                    <h4 className='font-bold text-large'>{listing.title}</h4>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
