import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Megaphone } from 'lucide-react';
import { Button, PageHeader, Tabs, TabsList, TabsTrigger } from '_shared';
import { ListingBrowser } from '_widgets';
import { useLostFound } from '../hooks';

export const LostFound = () => {
  const { t } = useTranslation();
  const { type, setType } = useLostFound();
  return (
    <div className='container py-8 sm:py-10'>
      <PageHeader
        title={t('lostFound.title')}
        description={t('lostFound.subtitle')}
        actions={
          <Button variant='warm' asChild>
            <Link to={`/create-listing?type=${type}`}>
              <Megaphone /> {t(`lostFound.report.${type}`)}
            </Link>
          </Button>
        }
      />
      <Tabs
        value={type}
        onValueChange={(v) => setType(v as 'lost' | 'found')}
        className='mb-6'
      >
        <TabsList>
          <TabsTrigger value='lost'>{t('lostFound.tabLost')}</TabsTrigger>
          <TabsTrigger value='found'>{t('lostFound.tabFound')}</TabsTrigger>
        </TabsList>
      </Tabs>
      <ListingBrowser
        key={type}
        type={type}
        variant='lostFound'
        preserve={['type']}
      />
    </div>
  );
};
