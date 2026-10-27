import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateListing, ListingType } from '_entities/listing';
import { useListingForm } from '_features/listing-form';

export const useCreateListingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = searchParams.get('type');
  const initialType: ListingType =
    t === 'lost' || t === 'found' ? t : 'adoption';
  const { createListing, isPending } = useCreateListing({
    onSuccess: (l) => navigate(`/animal/${l.id}`),
  });
  const { form, submit, listingType } = useListingForm({
    initialType,
    onValid: createListing,
  });
  return { form, submit, listingType, isPending, cancel: () => navigate(-1) };
};
