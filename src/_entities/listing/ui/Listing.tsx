import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@nextui-org/react';
import { Listing } from '../model';
import { useNavigate } from 'react-router-dom';
import { MdFavoriteBorder } from 'react-icons/md';

export const ListingItem = ({ listing }: { listing: Listing }) => {
  const navigate = useNavigate();
  return (
    <Card
      className='py-2 cursor-pointer'
      isPressable
      shadow='md'
      onClick={() => navigate(`/animal/${listing.id}`)}
    >
      <CardBody className='overflow-visible py-2'>
        <Image
          shadow='sm'
          radius='lg'
          width='100%'
          alt={listing.title}
          className='w-full object-cover h-[240px]'
          src={listing.images?.[0].url}
        />
      </CardBody>
      <CardHeader className='pb-0 pt-0 px-4 flex-col items-start'></CardHeader>
      <CardFooter className='flex justify-between items-start'>
        <div className='text-small flex-col justify-start items-start text-start'>
          <h4 className='font-bold text-large'>{listing.title}</h4>
          <p className='text-tiny uppercase font-bold'>
            {listing.category} &#x2022; {listing.gender}
          </p>
        </div>
        <MdFavoriteBorder />
      </CardFooter>
    </Card>
  );
};
