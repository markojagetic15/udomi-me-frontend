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

const OwnerListingCard = ({ listing }: { listing: Listing }) => {
  const { markAsAdopted, isPending: isAdopting } = useMarkAsAdopted();
  const { deleteListing, isPending: isDeleting } = useDeleteListing();

  return (
    <div className='relative'>
      {listing.is_adopted && (
        <div className='absolute inset-0 bg-green-50/80 backdrop-blur-[1px] rounded-2xl z-10 flex flex-col items-center justify-center gap-2'>
          <MdCheckCircle className='text-green-500 w-10 h-10' />
          <span className='font-bold text-green-700 text-sm'>Adopted</span>
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
            {isAdopting ? 'Saving...' : 'Mark Adopted'}
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
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to change password.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  return (
    <div className='bg-white rounded-3xl p-8 shadow-sm'>
      <h2 className='text-xl font-bold text-gray-800 mb-6'>Change Password</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-sm'>
        <NextInput
          type={showCurrent ? 'text' : 'password'}
          label='Current Password'
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
          label='New Password'
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
          label='Confirm New Password'
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
          {mutation.isPending ? 'Saving...' : 'Update Password'}
        </button>
      </form>
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
      <div className='flex flex-col items-center justify-center py-16 text-gray-400 bg-white/50 rounded-2xl'>
        <span className='text-4xl mb-3'>🐾</span>
        <p>{emptyMessage}</p>
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

  const adoptedCount = (myListings ?? []).filter((l) => l.is_adopted).length;
  const activeCount = (myListings ?? []).filter((l) => !l.is_adopted).length;

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full px-4'>
      {/* User card */}
      <div className='bg-white rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10'>
        <Avatar user={user} src={user?.avatar} size='lg' />
        <div className='text-center sm:text-left flex-1'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {user?.first_name} {user?.last_name}
          </h1>
          <p className='text-gray-500 mt-1'>{user?.email}</p>
          {user?.created_at && (
            <p className='text-sm text-gray-400 mt-1'>
              Member since {dayjs(user.created_at).format('MMMM YYYY')}
            </p>
          )}
        </div>
        {myListings && myListings.length > 0 && (
          <div className='flex gap-6 text-center'>
            <div>
              <p className='text-2xl font-extrabold text-primary'>{activeCount}</p>
              <p className='text-xs text-gray-400 mt-0.5'>Active</p>
            </div>
            <div>
              <p className='text-2xl font-extrabold text-green-500'>{adoptedCount}</p>
              <p className='text-xs text-gray-400 mt-0.5'>Adopted</p>
            </div>
          </div>
        )}
      </div>

      {/* My listings */}
      <div className='mb-12'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-bold text-gray-800'>My Listings</h2>
          {myListings && myListings.length > 0 && (
            <span className='text-sm text-gray-400'>{myListings.length} total</span>
          )}
        </div>
        <ListingsGrid
          listings={myListings}
          isLoading={isLoading}
          emptyMessage="You haven't posted any listings yet."
          isOwner
        />
      </div>

      {/* Favourited animals */}
      <div className='mb-12'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-bold text-gray-800'>Favourited Animals</h2>
          {favoriteListings && favoriteListings.length > 0 && (
            <span className='text-sm text-gray-400'>{favoriteListings.length} saved</span>
          )}
        </div>
        <ListingsGrid
          listings={favoriteListings}
          isLoading={isLoading}
          emptyMessage="You haven't favourited any animals yet."
        />
      </div>

      {/* Change password */}
      <ChangePasswordSection />
    </div>
  );
};
