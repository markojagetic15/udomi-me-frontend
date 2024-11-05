import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@nextui-org/react';
import { Listing } from '../model';

export const ListingItem = ({ listing }: { listing: Listing }) => {
  return (
    <Card className='py-2 cursor-pointer' isPressable shadow='md'>
      <CardBody className='overflow-visible py-2'>
        <Image
          shadow='sm'
          radius='lg'
          width='100%'
          alt={listing.title}
          className='w-full object-cover h-[240px]'
          src={listing.images?.[0].url}
          isZoomed
        />
      </CardBody>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'></CardHeader>
      <CardFooter className='text-small justify-between'>
        <h4 className='font-bold text-large'>{listing.title}</h4>
        <p className='text-tiny uppercase font-bold'>
          {listing.category} &#x2022; {listing.gender}
        </p>
      </CardFooter>
    </Card>
  );
};
