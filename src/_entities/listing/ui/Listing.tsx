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
import { MdFavorite } from 'react-icons/md';
import { useFavoriteListing } from '../api';
import { useGlobalContext } from '_app';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export const ListingItem = ({ listing }: { listing: Listing }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const { favoriteListing } = useFavoriteListing();
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  const handleFavorite = () => {
    if (!user) {
      toast.info('You need to login to favorite a listing');
      navigate('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    favoriteListing({ id: listing.id });
  };

  useEffect(() => {
    const favoriteListings = user?.favorite_listings || [];
    const favoriteListingsIds = favoriteListings.map((listing) => listing.id);
    setIsFavorite(favoriteListingsIds.includes(listing.id));
  }, [user]);

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
          <p className='font-bold text-large'>{listing.title}</p>
          <p className='text-tiny uppercase font-bold'>
            {listing.category} &#x2022; {listing.gender} &#x2022;{' '}
            {dayjs(listing.date_of_birth).format('MM.YYYY')}
          </p>
          <p className='text-tiny  text-gray-400 mt-1'>
            Created on {dayjs(listing.created_at).format('DD.MM.YYYY')}
          </p>
        </div>
        {isFavorite ? (
          <MdFavorite
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className='text-primary'
          />
        ) : (
          <MdFavoriteBorder
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className='text-primary'
          />
        )}
      </CardFooter>
    </Card>
  );
};
