import { useTranslation } from 'react-i18next';
import { ListingForm } from '_features/listing-form';
import { PageHeader, PageLoader } from '_shared';
import { ErrorPage } from '_pages/error';
import { useEditListingPage } from '../hooks';

export const EditListing = () => {
  const { t } = useTranslation();
  const {
    form,
    submit,
    listing,
    isPending,
    isLoading,
    notAllowed,
    notFound,
    cancel,
  } = useEditListingPage();
  if (isLoading) return <PageLoader />;
  if (notFound || !listing) return <ErrorPage code={404} />;
  if (notAllowed) return <ErrorPage code={403} />;
  return (
    <div className='container max-w-3xl py-8 sm:py-10'>
      <PageHeader
        title={t('listingForm.editTitle')}
        description={listing.title}
      />
      <ListingForm
        form={form}
        submit={submit}
        mode='edit'
        isPending={isPending}
        onCancel={cancel}
      />
    </div>
  );
};
