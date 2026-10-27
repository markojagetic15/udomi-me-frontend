import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalContext } from '_app';
import { useGetListing, useUpdateListing } from '_entities/listing';
import { useListingForm } from '_features/listing-form';

export const useEditListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const { getListing } = useGetListing(id);
  const listing = getListing.data?.listing;
  const { updateListing, isPending } = useUpdateListing({
    onSuccess: () => navigate(`/animal/${id}`),
  });
  // listing_type can't change after creation, so it's dropped from the payload.
  const { form, submit } = useListingForm({
    listing,
    onValid: (input) => {
      const data = { ...input };
      delete data.listing_type;
      updateListing({ id: id!, data });
    },
  });

  return {
    form,
    submit,
    listing,
    isPending,
    isLoading: getListing.isLoading,
    notAllowed: !!listing && listing.user?.id !== user?.id,
    notFound: getListing.isError,
    cancel: () => navigate(`/animal/${id}`),
  };
};
