import { useEffect, useMemo } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Listing, ListingType } from '_entities/listing';
import {
  emptyListingForm,
  formToInput,
  listingSchema,
  listingToForm,
  ListingFormValues,
} from '../model';

// Shared by create and edit. `onValid` receives the API payload.
export const useListingForm = ({
  listing,
  initialType,
  onValid,
}: {
  listing?: Listing;
  initialType?: ListingType;
  onValid: (input: ReturnType<typeof formToInput>) => void;
}) => {
  const { t } = useTranslation();
  const schema = useMemo(() => listingSchema(t), [t]);
  const form = useForm<ListingFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<ListingFormValues>,
    defaultValues: listing
      ? listingToForm(listing)
      : emptyListingForm(initialType),
    mode: 'onTouched',
  });

  // Edit page: the listing arrives after the first render.
  useEffect(() => {
    if (listing) form.reset(listingToForm(listing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.id]);

  const submit = form.handleSubmit(
    (values) => onValid(formToInput(values)),
    () => {
      // Bring the first invalid field into view on mobile.
      requestAnimationFrame(() =>
        document
          .querySelector('[aria-invalid="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    }
  );

  return { form, submit, listingType: form.watch('listing_type') };
};
