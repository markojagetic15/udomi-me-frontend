import { useTranslation } from 'react-i18next';
import { MailWarning } from 'lucide-react';
import { useGlobalContext } from '_app';
import { useResendVerification } from '_entities/user';
import { ListingForm } from '_features/listing-form';
import { Button, Card, PageHeader } from '_shared';
import { useCreateListingPage } from '../hooks';

export const CreateListing = () => {
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const {
    resendVerification,
    isPending: resending,
    isSuccess,
  } = useResendVerification();
  const { form, submit, listingType, isPending, cancel } =
    useCreateListingPage();

  return (
    <div className='container max-w-3xl py-8 sm:py-10'>
      <PageHeader
        title={t(`listingForm.createTitle.${listingType}`)}
        description={t('listingForm.createSubtitle')}
      />
      {user && !user.is_verified && user.verification_required ? (
        <Card className='flex flex-col items-center gap-4 p-8 text-center'>
          <MailWarning className='h-10 w-10 text-terracotta-500' />
          <h2 className='text-xl font-bold'>{t('verify.requiredTitle')}</h2>
          <p className='max-w-md text-muted-foreground'>
            {t('verify.requiredText', { email: user.email })}
          </p>
          <Button
            loading={resending}
            disabled={isSuccess}
            onClick={() => resendVerification()}
          >
            {isSuccess ? t('verify.resentShort') : t('verify.resend')}
          </Button>
        </Card>
      ) : (
        <ListingForm
          form={form}
          submit={submit}
          mode='create'
          isPending={isPending}
          onCancel={cancel}
        />
      )}
    </div>
  );
};
