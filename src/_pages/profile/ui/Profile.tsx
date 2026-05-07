import { Avatar, Spinner } from '_shared';
import { ListingItem, useDeleteListing, useMarkAsAdopted } from '_entities/listing';
import { useProfile } from '../hooks';
import dayjs from 'dayjs';
import { Listing } from '_entities/listing';
import { MdCheckCircle, MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAxios } from '_app';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Input as NextInput } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const OwnerListingCard = ({ listing }: { listing: Listing }) => {
  const { t } = useTranslation();
  const { markAsAdopted, isPending: isAdopting } = useMarkAsAdopted();
  const { deleteListing, isPending: isDeleting } = useDeleteListing();

  return (
    <div className='relative'>
      {listing.is_adopted && (
        <div className='absolute inset-0 bg-green-50/80 backdrop-blur-[1px] rounded-2xl z-10 flex flex-col items-center justify-center gap-2'>
          <MdCheckCircle className='text-green-500 w-10 h-10' />
          <span className='font-bold text-green-700 text-sm'>{t('animalInfo.adopted')}</span>
        </div>
      )}
      <ListingItem listing={listing} />
      {!listing.is_adopted && (
        <div className='flex gap-2 mt-2'>
          <button
            onClick={() => markAsAdopted({ id: listing.id })}
            disabled={isAdopting}
            className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            <MdCheckCircle className='w-4 h-4' />
            {isAdopting ? t('profile.saving') : t('profile.markAdopted')}
          </button>
          <button
            onClick={() => deleteListing({ id: listing.id })}
            disabled={isDeleting}
            className='flex items-center justify-center w-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50'
            aria-label='Delete listing'
          >
            <MdDelete className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  );
};

const ChangePasswordSection = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () =>
      axios.post('/change-password', { currentPassword, newPassword }),
    onSuccess: () => {
      toast.success(t('profile.changePassword.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || t('profile.changePassword.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = t('profile.changePassword.currentRequired');
    if (newPassword.length < 8) newErrors.newPassword = t('profile.changePassword.newTooShort');
    if (newPassword !== confirmPassword) newErrors.confirmPassword = t('profile.changePassword.passwordsMismatch');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  return (
    <div className='bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden'>
      <div className='px-8 py-5 border-b border-gray-100 bg-gray-50/50'>
        <h2 className='text-base font-bold text-gray-800'>{t('profile.changePassword.title')}</h2>
      </div>
      <div className='p-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-sm'>
          <NextInput
            type={showCurrent ? 'text' : 'password'}
            label={t('profile.changePassword.currentPassword')}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            isInvalid={!!errors.currentPassword}
            errorMessage={errors.currentPassword}
            autoComplete='current-password'
            endContent={
              <button type='button' onClick={() => setShowCurrent(!showCurrent)} className='flex items-center justify-center text-gray-400 hover:text-gray-600' tabIndex={-1}>
                {showCurrent ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            }
          />
          <NextInput
            type={showNew ? 'text' : 'password'}
            label={t('profile.changePassword.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            isInvalid={!!errors.newPassword}
            errorMessage={errors.newPassword}
            autoComplete='new-password'
            endContent={
              <button type='button' onClick={() => setShowNew(!showNew)} className='flex items-center justify-center text-gray-400 hover:text-gray-600' tabIndex={-1}>
                {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            }
          />
          <NextInput
            type={showConfirm ? 'text' : 'password'}
            label={t('profile.changePassword.confirmNewPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            autoComplete='new-password'
            endContent={
              <button type='button' onClick={() => setShowConfirm(!showConfirm)} className='flex items-center justify-center text-gray-400 hover:text-gray-600' tabIndex={-1}>
                {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            }
          />
          <button
            type='submit'
            disabled={mutation.isPending}
            className='py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {mutation.isPending ? t('profile.changePassword.saving') : t('profile.changePassword.updatePassword')}
          </button>
        </form>
      </div>
    </div>
  );
};

const ListingsGrid = ({
  listings,
  isLoading,
  emptyMessage,
  isOwner = false,
}: {
  listings: Listing[] | undefined;
  isLoading: boolean;
  emptyMessage: string;
  isOwner?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner />
      </div>
    );
  }
  if (!listings || listings.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-gray-400 bg-white/50 rounded-2xl border border-white/60'>
        <span className='text-4xl mb-3'>🐾</span>
        <p className='text-sm'>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className='grid 2xl:grid-cols-3 gap-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
      {listings.map((listing) =>
        isOwner ? (
          <OwnerListingCard key={listing.id} listing={listing} />
        ) : (
          <ListingItem listing={listing} key={listing.id} />
        ),
      )}
    </div>
  );
};

export const Profile = () => {
  const { myListings, favoriteListings, isLoading, user } = useProfile();
  const { t } = useTranslation();

  const adoptedCount = (myListings ?? []).filter((l) => l.is_adopted).length;
  const activeCount = (myListings ?? []).filter((l) => !l.is_adopted).length;

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-20 pb-24 h-full px-4'>
      {/* User card */}
      <div className='bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden mb-8'>
        {/* Gradient banner */}
        <div className='h-24 bg-gradient-to-r from-primary/60 via-primary/40 to-secondary/50' />
        <div className='px-8 pb-8 -mt-12 flex flex-col sm:flex-row items-start gap-6'>
          <div className='ring-4 ring-white rounded-full shadow-md'>
            <Avatar user={user} src={user?.avatar} size='lg' />
          </div>
          <div className='pt-12 sm:pt-14 flex-1 min-w-0'>
            <h1 className='text-2xl font-bold text-gray-900 truncate'>
              {user?.first_name} {user?.last_name}
            </h1>
            <p className='text-gray-500 mt-0.5 text-sm'>{user?.email}</p>
            {user?.created_at && (
              <p className='text-xs text-gray-400 mt-1'>
                {t('profile.memberSince')} {dayjs(user.created_at).format('MMMM YYYY')}
              </p>
            )}
          </div>
          {myListings && myListings.length > 0 && (
            <div className='flex gap-6 text-center pt-0 sm:pt-14 pb-2'>
              <div className='flex flex-col items-center'>
                <p className='text-3xl font-extrabold text-primary leading-none'>{activeCount}</p>
                <p className='text-xs text-gray-400 mt-1'>{t('profile.active')}</p>
              </div>
              <div className='w-px bg-gray-100' />
              <div className='flex flex-col items-center'>
                <p className='text-3xl font-extrabold text-green-500 leading-none'>{adoptedCount}</p>
                <p className='text-xs text-gray-400 mt-1'>{t('profile.adopted')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My listings */}
      <div className='mb-12'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-bold text-gray-800'>{t('profile.myListings')}</h2>
          {myListings && myListings.length > 0 && (
            <span className='text-sm text-gray-400 bg-white/60 px-3 py-1 rounded-full border border-gray-100'>
              {myListings.length} {t('profile.total')}
            </span>
          )}
        </div>
        <ListingsGrid
          listings={myListings}
          isLoading={isLoading}
          emptyMessage={t('profile.noListings')}
          isOwner
        />
      </div>

      {/* Favourited animals */}
      <div className='mb-12'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-bold text-gray-800'>{t('profile.favouritedAnimals')}</h2>
          {favoriteListings && favoriteListings.length > 0 && (
            <span className='text-sm text-gray-400 bg-white/60 px-3 py-1 rounded-full border border-gray-100'>
              {favoriteListings.length} {t('profile.saved')}
            </span>
          )}
        </div>
        <ListingsGrid
          listings={favoriteListings}
          isLoading={isLoading}
          emptyMessage={t('profile.noFavourites')}
        />
      </div>

      {/* Change password */}
      <ChangePasswordSection />
    </div>
  );
};
