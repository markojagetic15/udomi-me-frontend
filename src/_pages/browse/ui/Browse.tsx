import { useTranslation } from 'react-i18next';
import { PageHeader } from '_shared';
import { ListingBrowser } from '_widgets';

export const Browse = () => {
  const { t } = useTranslation();
  return (
    <div className='container py-8 sm:py-10'>
      <PageHeader
        title={t('browse.title')}
        description={t('browse.subtitle')}
      />
      <ListingBrowser type='adoption' variant='adoption' />
    </div>
  );
};
